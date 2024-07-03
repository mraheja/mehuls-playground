"use client";
import { TrackingEye } from "@/components/molecules/TrackingEye/TrackingEye";
import { useEffect, useRef } from "react";

const EyeTracker = () => {
  return (
    <div className="w-full h-[100dvh] flex justify-center items-center gap-x-2">
      <TrackingEye />
      <TrackingEye />
    </div>
  );
};

export default EyeTracker;
