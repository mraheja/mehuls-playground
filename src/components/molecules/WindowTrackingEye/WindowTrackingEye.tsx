"use client";

import { useRef, useEffect, useState } from "react";

// Types for our window state and messages
type WindowState = {
  screenX: number;
  screenY: number;
  width: number;
  height: number;
  eyePosition: { x: number; y: number };
};

type BroadcastMessage = {
  type: "windowUpdate" | "ping" | "pong";
  windowId: string;
  windowState?: WindowState;
  timestamp: number;
};

// Generate unique ID for each window
const generateId = () => Math.random().toString(36).substr(2, 9);

// Get current window state
const getCurrentWindowState = (eyePosition: { x: number; y: number }): WindowState => ({
  screenX: window.screenX,
  screenY: window.screenY,
  width: window.innerWidth,
  height: window.innerHeight,
  eyePosition,
});

// Check if window changed
const didWindowChange = (newWindow: WindowState, oldWindow: WindowState): boolean => {
  return (
    newWindow.screenX !== oldWindow.screenX ||
    newWindow.screenY !== oldWindow.screenY ||
    newWindow.width !== oldWindow.width ||
    newWindow.height !== oldWindow.height ||
    Math.abs(newWindow.eyePosition.x - oldWindow.eyePosition.x) > 1 ||
    Math.abs(newWindow.eyePosition.y - oldWindow.eyePosition.y) > 1
  );
};

// Base change function to convert coordinates between windows
const baseChange = ({
  currentWindowOffset,
  targetWindowOffset,
  targetPosition,
}: {
  currentWindowOffset: { x: number; y: number };
  targetWindowOffset: { x: number; y: number };
  targetPosition: { x: number; y: number };
}) => {
  const monitorCoordinate = {
    x: targetPosition.x + targetWindowOffset.x,
    y: targetPosition.y + targetWindowOffset.y,
  };
  const currentWindowCoordinate = {
    x: monitorCoordinate.x - currentWindowOffset.x,
    y: monitorCoordinate.y - currentWindowOffset.y,
  };
  return currentWindowCoordinate;
};

export const WindowTrackingEye = () => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Initializing...");
  const [otherWindows, setOtherWindows] = useState<Map<string, { windowState: WindowState; lastSeen: number }>>(new Map());
  const [windowId] = useState(() => generateId());
  
  useEffect(() => {
    // Create broadcast channel
    const channel = new BroadcastChannel('window-tracking-eyes');
    
    // Get initial eye position (center of eye)
    const getEyePosition = () => {
      const eyeBounds = eyeRef.current?.getBoundingClientRect();
      if (!eyeBounds) return { x: 0, y: 0 };
      return {
        x: eyeBounds.left + eyeBounds.width / 2,
        y: eyeBounds.top + eyeBounds.height / 2,
      };
    };
    
    let currentWindow = getCurrentWindowState(getEyePosition());
    
    // Listen for messages from other windows
    channel.onmessage = (event) => {
      const msg: BroadcastMessage = event.data;
      
      if (msg.windowId === windowId) return; // Ignore our own messages
      
      const now = Date.now();
      
      switch (msg.type) {
        case "windowUpdate": {
          if (msg.windowState) {
            setOtherWindows(prev => {
              const newMap = new Map(prev);
              newMap.set(msg.windowId, { 
                windowState: msg.windowState!, 
                lastSeen: now 
              });
              return newMap;
            });
          }
          break;
        }
        case "ping": {
          // Respond to ping with our current state
          channel.postMessage({
            type: "pong",
            windowId,
            windowState: currentWindow,
            timestamp: now,
          });
          break;
        }
        case "pong": {
          if (msg.windowState) {
            setOtherWindows(prev => {
              const newMap = new Map(prev);
              newMap.set(msg.windowId, { 
                windowState: msg.windowState!, 
                lastSeen: now 
              });
              return newMap;
            });
          }
          break;
        }
      }
    };
    
    // Send initial ping to discover other windows
    channel.postMessage({
      type: "ping",
      windowId,
      timestamp: Date.now(),
    });
    
    // Function to make this eye track another window's eye
    const trackOtherWindow = (targetWindow: { windowState: WindowState }) => {
      const eyeBounds = eyeRef.current?.getBoundingClientRect();
      const irisBounds = irisRef.current?.getBoundingClientRect();
      if (!eyeBounds || !irisBounds) return;
      
      // Get the position of the other window's eye in our coordinate system
      const currentWindowOffset = {
        x: window.screenX,
        y: window.screenY,
      };
      
      const targetWindowOffset = {
        x: targetWindow.windowState.screenX,
        y: targetWindow.windowState.screenY,
      };
      
      const targetEyePosition = baseChange({
        currentWindowOffset,
        targetWindowOffset,
        targetPosition: targetWindow.windowState.eyePosition,
      });
      
      // Calculate angle between this eye and the target eye
      const eyeCenter = {
        x: eyeBounds.left + eyeBounds.width / 2,
        y: eyeBounds.top + eyeBounds.height / 2,
      };
      
      const angle = Math.atan2(
        targetEyePosition.y - eyeCenter.y,
        targetEyePosition.x - eyeCenter.x
      );
      
      // Calculate iris position
      const radius = eyeBounds.width / 2 - irisBounds.width / 2;
      const centerX = radius * Math.cos(angle);
      const centerY = radius * Math.sin(angle);
      
      if (irisRef.current) {
        irisRef.current.style.transform = `translate(${centerX}px, ${centerY}px)`;
      }
    };
    
    // Periodically check for window changes and clean up stale windows
    const interval = setInterval(() => {
      const newWindow = getCurrentWindowState(getEyePosition());
      
      // Send update if window changed
      if (didWindowChange(newWindow, currentWindow)) {
        channel.postMessage({
          type: "windowUpdate",
          windowId,
          windowState: newWindow,
          timestamp: Date.now(),
        });
        currentWindow = newWindow;
      }
      
      // Clean up stale windows (not seen for 3 seconds)
      const now = Date.now();
      setOtherWindows(prev => {
        const newMap = new Map(prev);
        for (const [id, data] of newMap) {
          if (now - data.lastSeen > 3000) {
            newMap.delete(id);
          }
        }
        return newMap;
      });
    }, 100);
    
    // Send periodic pings to maintain connection
    const pingInterval = setInterval(() => {
      channel.postMessage({
        type: "ping",
        windowId,
        timestamp: Date.now(),
      });
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(pingInterval);
      channel.close();
    };
  }, [windowId]);
  
  // Update connection status and track other windows
  useEffect(() => {
    const windowCount = otherWindows.size;
    
    if (windowCount === 0) {
      setConnectionStatus("No other windows found");
    } else if (windowCount === 1) {
      setConnectionStatus("Connected to 1 other window");
      // Track the single other window
      const [otherWindow] = otherWindows.values();
      trackOtherWindow(otherWindow);
    } else {
      setConnectionStatus(`Found ${windowCount} other windows - tracking first one`);
      // Track the first window
      const [firstWindow] = otherWindows.values();
      trackOtherWindow(firstWindow);
    }
  }, [otherWindows]);
  
  const trackOtherWindow = (targetWindow: { windowState: WindowState }) => {
    const eyeBounds = eyeRef.current?.getBoundingClientRect();
    const irisBounds = irisRef.current?.getBoundingClientRect();
    if (!eyeBounds || !irisBounds) return;
    
    // Get the position of the other window's eye in our coordinate system
    const currentWindowOffset = {
      x: window.screenX,
      y: window.screenY,
    };
    
    const targetWindowOffset = {
      x: targetWindow.windowState.screenX,
      y: targetWindow.windowState.screenY,
    };
    
    const targetEyePosition = baseChange({
      currentWindowOffset,
      targetWindowOffset,
      targetPosition: targetWindow.windowState.eyePosition,
    });
    
    // Calculate angle between this eye and the target eye
    const eyeCenter = {
      x: eyeBounds.left + eyeBounds.width / 2,
      y: eyeBounds.top + eyeBounds.height / 2,
    };
    
    const angle = Math.atan2(
      targetEyePosition.y - eyeCenter.y,
      targetEyePosition.x - eyeCenter.x
    );
    
    // Calculate iris position
    const radius = eyeBounds.width / 2 - irisBounds.width / 2;
    const centerX = radius * Math.cos(angle);
    const centerY = radius * Math.sin(angle);
    
    if (irisRef.current) {
      irisRef.current.style.transform = `translate(${centerX}px, ${centerY}px)`;
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-sm text-gray-600 text-center">
        {connectionStatus}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Window ID: {windowId}
      </div>
      
      <div
        className="rounded-full w-16 h-16 border-4 border-black flex justify-center items-center bg-white"
        ref={eyeRef}
      >
        <div className="rounded-full w-6 h-6 bg-black transition-transform duration-100" ref={irisRef} />
      </div>
      
      <div className="text-xs text-gray-500 text-center max-w-md">
        Open this page in multiple windows to see the eyes track each other! 
        Each eye will look at the other window's eye position.
      </div>
      
      {otherWindows.size > 0 && (
        <div className="text-xs text-green-600 text-center">
          Active connections: {otherWindows.size}
        </div>
      )}
      
      <div className="text-xs text-gray-400 text-center">
        Debug: screenX={window.screenX}, screenY={window.screenY}
      </div>
    </div>
  );
};