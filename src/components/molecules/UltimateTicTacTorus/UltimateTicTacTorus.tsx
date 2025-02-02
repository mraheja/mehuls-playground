'use client'

import { TicTacToe } from "../TicTacToe/TicTacToe";
import { useState, useEffect } from "react";
import { UltimateTicTacToeProvider } from "@/contexts/UltimateTicTacToeContext";

export interface UltimateTicTacTorusProps {
  className?: string;
}

export const UltimateTicTacTorus: React.FC<UltimateTicTacTorusProps> = ({
  className,
}) => {
  const [visibleBoards, setVisibleBoards] = useState(-1);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleBoards((prev) => (prev < 8 ? prev + 1 : prev));
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const board = (
    <div className="grid grid-cols-3 gap-3 w-[500px] place-items-center">
      {Array(9)
        .fill(null)
        .map((_, index) => (
          <div className="border-2 border-gray-600 p-1 rounded-sm" key={index}>
            <TicTacToe boardIndex={index} />
          </div>
        ))}
    </div>
  );

  const absoluteBoards = [
    "top-0 left-full translate-x-3",
    "top-0 right-full -translate-x-3",
    "bottom-full left-0 -translate-y-3",
    "top-full left-0 translate-y-3",
    "top-full right-full translate-y-3 -translate-x-3",
    "bottom-full right-full -translate-y-3 -translate-x-3",
    "top-full left-full translate-y-3 translate-x-3",
    "bottom-full left-full -translate-y-3 translate-x-3",
  ];

  return (
    <UltimateTicTacToeProvider>
      <div className="relative">
        <div className={`transition-opacity duration-500 ${visibleBoards >= 0 ? "opacity-100" : "opacity-0"}`}>
          {board}
        </div>
        {absoluteBoards.map((position, index) => (
          <div
            key={index}
            className={`absolute ${position} transition-opacity duration-500 ${
              index < visibleBoards ? "opacity-30" : "opacity-0"
            }`}
          >
            {board}
          </div>
        ))}
      </div>
    </UltimateTicTacToeProvider>
  );
};
