"use client";

import { Gear } from "@/components/atoms/Gear/Gear";
import { useEffect, useState } from "react";

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
