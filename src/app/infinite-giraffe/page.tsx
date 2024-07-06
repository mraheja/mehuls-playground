"use client";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

const GIRAFFE_HEAD = `
    /)/)
    ( ..\     
    /'-._)   
   /#/       
  /#/`;

const GIRAFFE_NECK = "  |#|";

const CLOUD = `
          .-~~~-.
  .- ~ ~-(       )_ _
 /                    ~ -.
|                          ',
 \\                         .'
   ~- ._ ,. ,.,.,., ,.. -~

`;

const STAR = `
   ,
__/ \\__
\\     /
/_   _\\
  \\ /
   '
`;

const PLANE = `
__
\\  \\     _ _
 \\**\\ ___\\/ \\
X*#####*+^^\\_\\
 o/\\  \\
    \\__\\
`;

const MOUNTAIN = `
          /\
         /**\
        /****\   /\
       /      \ /**\
      /  /\    /    \        /\    /\  /\      /\            /\/\/\  /\
     /  /  \  /      \      /  \/\/  \/  \  /\/  \/\  /\  /\/ / /  \/  \
    /  /    \/ /\     \    /    \ \  /    \/ /   /  \/  \/  \  /    \   \
   /  /      \/  \/\   \  /      \    /   /    \
__/__/_______/___/__\___\__________________________________________________
`;

const NUM_CLOUDS = 5;
const SEGMENT_HEIGHT = 1000;

const SEGMENTS = [STAR, STAR, STAR, CLOUD, CLOUD, PLANE, CLOUD, CLOUD, ""];

const InfiniteGiraffe = () => {
  const [numNecks, setNumNecks] = useState(10);
  const [ready, setReady] = useState(false);
  const [startFading, setStartFading] = useState(false);
  const asciiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setNumNecks((prevNumNecks) =>
        Math.max(
          prevNumNecks,
          Math.ceil((window.innerHeight + window.scrollY) / 36)
        )
      );
      setStartFading(true);
      setTimeout(() => setReady(true), 1000);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const elements = useMemo(() => {
    if (typeof window === "undefined") return [];
    const elements = [];

    let baseHeight = 0;

    for (let seg = 0; seg < SEGMENTS.length; seg++) {
      baseHeight = seg * SEGMENT_HEIGHT;
      for (let i = 0; i < (SEGMENTS[seg] == PLANE ? 2 : NUM_CLOUDS); i++) {
        const leftSide = Math.random() < 0.5;
        let styleBuilder = {
          top: baseHeight + Math.random() * SEGMENT_HEIGHT,
          fontSize: Math.random() * 10 + 10,
        };
        const element = leftSide
          ? { ...styleBuilder, left: (Math.random() * window.innerWidth) / 4 }
          : { ...styleBuilder, right: (Math.random() * window.innerWidth) / 4 };
        elements.push({
          element: (
            <pre className="font-mono absolute" style={element}>
              {SEGMENTS[seg]}
            </pre>
          ),
        });
      }
    }

    elements.push({
      element: (
        <div
          className="absolute w-full h-2 bg-black"
          style={{ top: baseHeight + SEGMENT_HEIGHT }}
        />
      ),
    });

    return elements;
  }, [ready]);

  if (!ready) {
    return (
      <div className="flex justify-center items-center min-h-[100dvh]">
        <div
          className={cn(
            "mt-4 transition-opacity duration-1000 ease-in-out opacity-100",
            startFading && "opacity-0"
          )}
        >
          Welcome to infinite giraffe...
        </div>
      </div>
    );
  }

  return (
    <>
      {elements.map((element) => element.element)}
      <div className="flex justify-center items-center flex-col min-h-[100dvh]">
        <div ref={asciiRef}>
          <pre className="text-3xl font-mono">{GIRAFFE_HEAD}</pre>
          {[...Array(numNecks)].map((_, i) => (
            <pre key={i} className="-mx-[7px] my-1 text-3xl font-mono">
              {GIRAFFE_NECK}
            </pre>
          ))}
        </div>
      </div>
    </>
  );
};

export default InfiniteGiraffe;
