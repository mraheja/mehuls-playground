'use client'

import { TicTacToe } from "../TicTacToe/TicTacToe";
import { useState, useEffect } from "react";
import { UltimateTicTacToeProvider, useUltimateTicTacToe } from "@/contexts/UltimateTicTacToeContext";

// Function to calculate relative board movement with torus wrapping
const getRelativeBoard = (currentBoardIndex: number, position: number): number => {
  const currentRow = Math.floor(currentBoardIndex / 3);
  const currentCol = currentBoardIndex % 3;
  const moveRow = Math.floor(position / 3);
  const moveCol = position % 3;

  // Calculate relative movement with wrapping
  const newRow = (currentRow + moveRow - 1 + 3) % 3;
  const newCol = (currentCol + moveCol - 1 + 3) % 3;

  return newRow * 3 + newCol;
};

const BoardContainer = ({ index, children, showDottedBorder }: { index: number, children: React.ReactNode, showDottedBorder?: boolean }) => {
  const { currentBoard } = useUltimateTicTacToe();
  const isActive = currentBoard === null || currentBoard === index;

  const colors = [
    "bg-red-50",
    "bg-blue-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-purple-50",
    "bg-pink-50",
    "bg-indigo-50",
    "bg-orange-50",
    "bg-teal-50"
  ];

  return (
    <div className={`border-2 p-1 rounded-sm transition-all duration-200 ${colors[index]} ${
      isActive ? "border-gray-600" : "border-gray-300"
    } ${showDottedBorder ? "!border-dotted !border-gray-600 !opacity-100" : ""}`}>
      {children}
    </div>
  );
};

const GameBoard = () => {
  const { currentTurn, gameState, boardWinners } = useUltimateTicTacToe();
  const [visibleBoards, setVisibleBoards] = useState(-1);
  const [showTurnIndicator, setShowTurnIndicator] = useState(false);
  const [hoveredMove, setHoveredMove] = useState<{board: number, position: number} | null>(null);

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

  const handleSquareHover = (boardIndex: number, position: number | null) => {
    if (position === null) {
      setHoveredMove(null);
    } else {
      setHoveredMove({ board: boardIndex, position });
    }
  };

  const getNextBoard = () => {
    if (!hoveredMove) return null;
    
    // If position is center (4), stay in the same board
    if (hoveredMove.position === 4) {
      // If current board is won or full, allow playing anywhere
      const isCurrentBoardWon = boardWinners[hoveredMove.board] !== null;
      const isCurrentBoardFull = !gameState[hoveredMove.board].includes(null);
      return isCurrentBoardWon || isCurrentBoardFull ? null : hoveredMove.board;
    }
    
    const nextBoard = getRelativeBoard(hoveredMove.board, hoveredMove.position);
    
    // If target board is won or full, allow playing anywhere
    const isTargetBoardWon = boardWinners[nextBoard] !== null;
    const isTargetBoardFull = !gameState[nextBoard].includes(null);
    
    return isTargetBoardWon || isTargetBoardFull ? null : nextBoard;
  };

  const nextBoard = getNextBoard();
  const showAllDotted = hoveredMove && nextBoard === null;

  const board = (
    <div className="grid grid-cols-3 gap-3 w-[500px] place-items-center">
      {Array(9)
        .fill(null)
        .map((_, index) => (
          <BoardContainer 
            key={index} 
            index={index}
            showDottedBorder={showAllDotted || nextBoard === index}
          >
            <TicTacToe 
              boardIndex={index}
              onHoverSquare={(position) => handleSquareHover(index, position)}
            />
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
      <div className={`relative p-2 rounded-xl shadow-sm transition-all duration-500 ${visibleBoards >= 8 ? "bg-white" : ""} ${
        showAllDotted ? "!border-2 !border-dotted !border-gray-600 !opacity-100" : ""
      }`}>
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
