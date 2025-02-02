'use client'

import { TicTacToe } from "../TicTacToe/TicTacToe";
import { useState, useEffect } from "react";
import { UltimateTicTacToeProvider, useUltimateTicTacToe } from "@/contexts/UltimateTicTacToeContext";

const BoardContainer = ({ index, children }: { index: number, children: React.ReactNode }) => {
  const { currentBoard } = useUltimateTicTacToe();
  const isActive = currentBoard === null || currentBoard === index;

  return (
    <div className={`border-2 p-1 rounded-sm transition-colors duration-200 ${
      isActive ? "border-gray-600" : "border-gray-300"
    }`}>
      {children}
    </div>
  );
};

const GameBoard = () => {
  const { currentTurn } = useUltimateTicTacToe();
  const [visibleBoards, setVisibleBoards] = useState(-1);
  const [showTurnIndicator, setShowTurnIndicator] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleBoards((prev) => (prev < 8 ? prev + 1 : prev));
    }, 200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (visibleBoards === 8) {
      setTimeout(() => {
        setShowTurnIndicator(true);
      }, 300); // Wait a bit after the last board appears
    }
  }, [visibleBoards]);

  const board = (
    <div className="grid grid-cols-3 gap-3 w-[500px] place-items-center">
      {Array(9)
        .fill(null)
        .map((_, index) => (
          <BoardContainer key={index} index={index}>
            <TicTacToe boardIndex={index} />
          </BoardContainer>
        ))}
    </div>
  );

  const absoluteBoards = [
    "top-2 left-full translate-x-1",
    "top-2 right-full -translate-x-1",
    "bottom-full left-2 -translate-y-1",
    "top-full left-2 translate-y-1",
    "top-full right-full translate-y-1 -translate-x-1",
    "bottom-full right-full -translate-y-1 -translate-x-1",
    "top-full left-full translate-y-1 translate-x-1",
    "bottom-full left-full -translate-y-1 translate-x-1",
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className={`relative p-2 rounded-xl shadow-sm transition-colors duration-500 ${visibleBoards >= 8 ? "bg-white" : ""}`}>
        <div className={`transition-opacity duration-500 ${visibleBoards === 8 ? "opacity-100" : visibleBoards >= 0 ? "opacity-30" : "opacity-0"}`}>
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
      <div className={`text-2xl font-bold bg-white px-6 py-3 rounded-xl shadow-sm z-10 relative transition-all duration-500 transform ${
        showTurnIndicator ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        Player {currentTurn}'s Turn
      </div>
    </div>
  );
};

export interface UltimateTicTacTorusProps {
  className?: string;
}

export const UltimateTicTacTorus: React.FC<UltimateTicTacTorusProps> = ({
  className,
}) => {
  return (
    <UltimateTicTacToeProvider>
      <GameBoard />
    </UltimateTicTacToeProvider>
  );
};
