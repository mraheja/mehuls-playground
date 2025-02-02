'use client'

import { useUltimateTicTacToe } from "@/contexts/UltimateTicTacToeContext";

const colors = {
  0: { bg: "hover:bg-red-100" },
  1: { bg: "hover:bg-blue-100" },
  2: { bg: "hover:bg-green-100" },
  3: { bg: "hover:bg-yellow-100" },
  4: { bg: "hover:bg-purple-100" },
  5: { bg: "hover:bg-pink-100" },
  6: { bg: "hover:bg-indigo-100" },
  7: { bg: "hover:bg-orange-100" },
  8: { bg: "hover:bg-teal-100" }
};

export interface TicTacToeProps {
  boardIndex: number;
  className?: string;
  onHoverSquare?: (position: number | null) => void;
  disabled?: boolean;
}

export const TicTacToe: React.FC<TicTacToeProps> = ({ 
  boardIndex,
  className,
  onHoverSquare,
  disabled
}) => {
  const { gameState, currentTurn, onPlay, currentBoard, boardWinners } = useUltimateTicTacToe();
  const isActive = currentBoard === null || currentBoard === boardIndex;
  const boardWinner = boardWinners[boardIndex];

  const handleHover = (position: number | null) => {
    if (disabled || !isActive || boardWinner || (position !== null && gameState[boardIndex][position])) return;
    onHoverSquare?.(position);
  };

  const handleClick = (position: number) => {
    if (disabled || !isActive || boardWinner || gameState[boardIndex][position]) return;
    onPlay(boardIndex, position);
  };

  const boardContent = (
    <div 
      className={`grid grid-cols-3 gap-1 ${className} ${
        !boardWinner ? "opacity-100" : "opacity-50"
      }`}
    >
      {Array(9).fill(null).map((_, index) => (
        <div
          key={index}
          className={`h-12 w-12 border-2 ${
            isActive && !boardWinner ? "border-gray-600" : "border-gray-300"
          } flex items-center justify-center text-4xl cursor-pointer rounded-md ${
            !gameState[boardIndex][index] && !boardWinner && !disabled ? colors[boardIndex].bg : ""
          }`}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleHover(index)}
          onMouseLeave={() => handleHover(null)}
        >
          {gameState[boardIndex][index]}
        </div>
      ))}
    </div>
  );

  if (boardWinner) {
    return (
      <div className="relative w-[150px] h-[150px]">
        <div className="absolute inset-0 opacity-30">
          {boardContent}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl font-bold text-indigo-600">{boardWinner}</span>
        </div>
      </div>
    );
  }

  return boardContent;
};