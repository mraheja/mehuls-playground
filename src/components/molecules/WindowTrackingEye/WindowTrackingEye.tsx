"use client";

import React, { useRef, useEffect } from "react";
import { baseChange, WindowState } from "./useWindowTrackingEyes";

export const WindowTrackingEye = ({
  screenX,
  screenY,
  targetWindow,
  setEyePosition,
}: {
  screenX: number;
  screenY: number;
  targetWindow?: { windowState: WindowState };
  setEyePosition: (pos: { x: number; y: number }) => void;
}) => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);

  // Report the center of the eye to the hook
  useEffect(() => {
    const update = () => {
      const eyeBounds = eyeRef.current?.getBoundingClientRect();
      if (eyeBounds) {
        setEyePosition({
          x: eyeBounds.left + eyeBounds.width / 2,
          y: eyeBounds.top + eyeBounds.height / 2,
        });
      }
    };
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [setEyePosition]);

  // Move iris to track the target window's eye
  useEffect(() => {
    if (!targetWindow) return;
    const eyeBounds = eyeRef.current?.getBoundingClientRect();
    const irisBounds = irisRef.current?.getBoundingClientRect();
    if (!eyeBounds || !irisBounds) return;
    const currentWindowOffset = {
      x: screenX,
      y: screenY,
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
    const eyeCenter = {
      x: eyeBounds.left + eyeBounds.width / 2,
      y: eyeBounds.top + eyeBounds.height / 2,
    };
    const angle = Math.atan2(
      targetEyePosition.y - eyeCenter.y,
      targetEyePosition.x - eyeCenter.x
    );
    const radius = eyeBounds.width / 2 - irisBounds.width / 2;
    const centerX = radius * Math.cos(angle);
    const centerY = radius * Math.sin(angle);
    if (irisRef.current) {
      irisRef.current.style.transform = `translate(${centerX}px, ${centerY}px)`;
    }
  }, [targetWindow, screenX, screenY]);

  return (
    <div
      className="rounded-full w-16 h-16 border-4 border-black flex justify-center items-center bg-white"
      ref={eyeRef}
    >
      <div className="rounded-full w-6 h-6 bg-black transition-transform duration-100" ref={irisRef} />
    </div>
  );
};