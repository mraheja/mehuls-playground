'use client';
import React from "react";
import { WindowTrackingEye } from "@/components/molecules/WindowTrackingEye/WindowTrackingEye";
import { useWindowTrackingEyes } from "@/components/molecules/WindowTrackingEye/useWindowTrackingEyes";
import { isMobileDevice } from "@/utils/isMobileDevice";

// If you want to keep mobile detection, you can use a simple effect or just remove it for now
// For now, we'll just default to false for isMobile

const WindowEyeTracker = () => {
  const {
    connectionStatus,
    windowId,
    otherWindows,
    screenX,
    screenY,
    setEyePosition,
  } = useWindowTrackingEyes();

  // Optionally, you can add a useEffect to set isMobile if you want
  // For now, just set to false
  const isMobile = false;

  // Get the list of other windows
  const otherWindowList = Array.from(otherWindows.values());
  const target1 = otherWindowList[0];
  const target2 = otherWindowList[1] || otherWindowList[0];
  const showText = otherWindowList.length !== 1 && otherWindowList.length !== 2;

  return (
    <div className="w-full h-[100dvh] flex flex-col justify-center items-center">
      {showText && (
        <div className="flex flex-col items-center gap-1 mb-2">
          <div className="text-sm text-gray-600 text-center">{connectionStatus}</div>
          <div className="text-xs text-gray-500 text-center max-w-md">
            Open this page in multiple windows to see the eyes track each other! Each eye will look at the other window's eye position.
          </div>
          {otherWindows.size > 0 && (
            <div className="text-xs text-green-600 text-center">Active connections: {otherWindows.size}</div>
          )}
        </div>
      )}
      <div className="flex justify-center items-center gap-x-1">
        <WindowTrackingEye
          screenX={screenX}
          screenY={screenY}
          targetWindow={target1}
          setEyePosition={setEyePosition}
        />
        <WindowTrackingEye
          screenX={screenX}
          screenY={screenY}
          targetWindow={target2}
          setEyePosition={setEyePosition}
        />
      </div>
      {isMobile && <span className="absolute bottom-3">Touch anywhere</span>}
    </div>
  );
};

export default WindowEyeTracker;
