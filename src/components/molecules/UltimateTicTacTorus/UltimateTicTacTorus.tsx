'use client'

import { TicTacToe } from "../TicTacToe/TicTacToe";
import { useState, useEffect } from "react";
import { UltimateTicTacToeProvider, useUltimateTicTacToe } from "@/contexts/UltimateTicTacToeContext";
import { UndoIcon } from "lucide-react";

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
    <div className={`p-1 rounded-sm transition-all duration-200 ${colors[index]} 
    ${showDottedBorder ? "!ring-gray-300 ring-[1px]" : ""}`}>
      {children}
    </div>
  );
};

const GameBoard = () => {
  const { currentTurn, gameState, boardWinners, gameWinner, onUndo, canUndo } = useUltimateTicTacToe();
  const [visibleBoards, setVisibleBoards] = useState(-1);
  const [showTurnIndicator, setShowTurnIndicator] = useState(false);
  const [hoveredMove, setHoveredMove] = useState<{board: number, position: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleBoards((prev) => {
        if (prev === 7) {
          clearInterval(timer);
          setTimeout(() => {
            setIsLoading(false);
          }, 500); // Give a little extra time after the last board appears
        }
        return prev < 8 ? prev + 1 : prev;
      });
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
    if (isLoading) return;
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
              disabled={isLoading}
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
      <div className="relative w-full">
        <div className={`relative p-2 rounded-xl shadow-sm transition-all duration-500 ${showTurnIndicator ? "bg-white" : ""}`}>
          <div className={`transition-opacity duration-500 ${showTurnIndicator ? "opacity-100" : visibleBoards >= 0 ? "opacity-30" : "opacity-0"}`}>
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
      </div>
      <div className="relative">
        <div className={`text-2xl font-bold bg-white px-6 py-3 rounded-xl shadow-sm z-10 relative transition-all duration-500 transform ${
          showTurnIndicator ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          {gameWinner 
            ? `Player ${gameWinner} wins!`
            : gameState.every(board => board.every(cell => cell === null))
              ? "Welcome to Ultimate Tic-Tac-Torus!"
              : `Player ${currentTurn}'s Turn`}
        </div>
        {canUndo && (
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-7">
            <button
              onClick={onUndo}
              className="text-xs font-medium px-3 py-1 rounded-b-lg transition-all duration-200 
                bg-gray-400 text-gray-700 hover:bg-gray-700 shadow-sm -translate-y-2"
            >
              <UndoIcon className="h-3 w-3 stroke-white" />
            </button>
          </div>
        )}
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
