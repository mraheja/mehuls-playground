"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface GearProps {
  width: number;
  numSpokes: number;
  spokeRadius: number;
  spokeSize: number;
  className?: string;
  offset?: number; // Angle offset in degrees
}

const Gear = ({
  width,
  numSpokes,
  spokeRadius,
  spokeSize,
  className = "",
  offset = 0,
}: GearProps) => {
  return (
    <div
      className={cn(
        "relative bg-primary rounded-full border flex justify-center items-center",
        className
      )}
      style={{ width: width - spokeRadius, height: width - spokeRadius }}
    >
      <div className="rounded-full bg-background w-3 h-3 z-10" />
      {Array.from({ length: numSpokes }, (_, i) => (
        <div
          key={i}
          className={cn(
            "absolute bg-primary left-1/2 top-1/2 rounded-sm",
            className
          )}
          style={{
            width: width / 2,
            height: spokeSize,
            transformOrigin: "0 50%",
            transform: `translate(0%, -50%) rotate(${
              (360 / numSpokes) * i + offset
            }deg)`,
          }}
        />
      ))}
    </div>
  );
};

const ScrollGearPage = () => {
  const [offset, setOffset] = useState(0);
  const [height, setHeight] = useState("10000px");

  useEffect(() => {
    const handleScroll = () => {
      const newOffset = window.scrollY / 20;
      setOffset(newOffset);
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setHeight(`${parseInt(height) + 10000}px`);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [height]);

  return (
    <div style={{ height: height }}>
      <div className="flex justify-center items-center w-full h-[100dvh] gap-x-2 fixed">
        <Gear
          width={100}
          numSpokes={12}
          spokeRadius={20}
          spokeSize={10}
          offset={offset}
          className="bg-red-400"
        />
        <Gear
          width={100}
          numSpokes={12}
          spokeRadius={20}
          spokeSize={10}
          offset={-offset + 15}
          className="bg-green-400"
        />
        <Gear
          width={100}
          numSpokes={12}
          spokeRadius={20}
          spokeSize={10}
          offset={offset}
          className="bg-blue-400"
        />
      </div>
      <div className="fixed bottom-3 left-[50%] translate-x-[-50%]">
        Scroll!
      </div>
    </div>
  );
};

export default ScrollGearPage;
