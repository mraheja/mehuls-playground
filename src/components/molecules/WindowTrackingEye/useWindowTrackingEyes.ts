import { useEffect, useState, useRef } from "react";

// Types for our window state and messages
export type WindowState = {
  screenX: number;
  screenY: number;
  width: number;
  height: number;
  eyePosition: { x: number; y: number };
};

export type BroadcastMessage = {
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
export const baseChange = ({
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

export function useWindowTrackingEyes() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Initializing...");
  const [otherWindows, setOtherWindows] = useState<
    Map<string, { windowState: WindowState; lastSeen: number }>
  >(new Map());
  const [windowId] = useState(() => generateId());
  const [screenX, setScreenX] = useState(typeof window !== 'undefined' ? window.screenX : 0);
  const [screenY, setScreenY] = useState(typeof window !== 'undefined' ? window.screenY : 0);

  // Store the local eye position in a ref
  const localEyePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const setEyePosition = (pos: { x: number; y: number }) => {
    localEyePosition.current = pos;
  };

  // Update screenX and screenY on interval
  useEffect(() => {
    const update = () => {
      setScreenX(window.screenX);
      setScreenY(window.screenY);
    };
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Create broadcast channel
    const channel = new BroadcastChannel("window-tracking-eyes");

    // Get current eye position from ref
    const getEyePosition = () => localEyePosition.current;

    let currentWindow = getCurrentWindowState(getEyePosition());

    // Listen for messages from other windows
    channel.onmessage = (event) => {
      const msg: BroadcastMessage = event.data;
      if (msg.windowId === windowId) return; // Ignore our own messages
      const now = Date.now();
      switch (msg.type) {
        case "windowUpdate": {
          if (msg.windowState) {
            setOtherWindows((prev) => {
              const newMap = new Map(prev);
              newMap.set(msg.windowId, {
                windowState: msg.windowState!,
                lastSeen: now,
              });
              return newMap;
            });
          }
          break;
        }
        case "ping": {
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
            setOtherWindows((prev) => {
              const newMap = new Map(prev);
              newMap.set(msg.windowId, {
                windowState: msg.windowState!,
                lastSeen: now,
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

    // Periodically check for window changes and clean up stale windows
    const interval = setInterval(() => {
      // Use the latest eye position
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
      setOtherWindows((prev) => {
        const newMap = new Map(prev);
        for (const [id, data] of Array.from(newMap)) {
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

  useEffect(() => {
    const windowCount = otherWindows.size;
    if (windowCount === 0) {
      setConnectionStatus("No other windows found");
    } else if (windowCount === 1) {
      setConnectionStatus("Connected to 1 other window");
    } else {
      setConnectionStatus(`Found ${windowCount} other windows - tracking first one`);
    }
  }, [otherWindows]);

  return {
    connectionStatus,
    windowId,
    otherWindows,
    screenX,
    screenY,
    setEyePosition,
  };
} 