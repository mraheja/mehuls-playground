// @ts-nocheck
'use client'

import { useUltimateTicTacToe } from "@/contexts/UltimateTicTacToeContext";

const colors = {
  0: { bg: "hover:bg-rose-200", border: "border-rose-400", inactiveBorder: "border-rose-200" },      // Modern pink-red
  1: { bg: "hover:bg-sky-200", border: "border-sky-400", inactiveBorder: "border-sky-200" },       // Fresh light blue
  2: { bg: "hover:bg-emerald-200", border: "border-emerald-400", inactiveBorder: "border-emerald-200" },   // Contemporary green
  3: { bg: "hover:bg-violet-200", border: "border-violet-400", inactiveBorder: "border-violet-200" },    // Trendy purple
  4: { bg: "hover:bg-amber-200", border: "border-amber-400", inactiveBorder: "border-amber-200" },     // Warm golden
  5: { bg: "hover:bg-cyan-200", border: "border-cyan-400", inactiveBorder: "border-cyan-200" },      // Modern turquoise
  6: { bg: "hover:bg-fuchsia-200", border: "border-fuchsia-400", inactiveBorder: "border-fuchsia-200" },   // Vibrant pink
  7: { bg: "hover:bg-lime-200", border: "border-lime-400", inactiveBorder: "border-lime-200" },      // Fresh lime
  8: { bg: "hover:bg-orange-200", border: "border-orange-400", inactiveBorder: "border-orange-200" }      // Bright orange
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
  const { gameState, currentTurn, onPlay, currentBoard, boardWinners, gameWinner } = useUltimateTicTacToe();
  const boardWinner = boardWinners[boardIndex];
  const isActive = (currentBoard === null || currentBoard === boardIndex) && !boardWinner;

  const handleHover = (position: number | null) => {
    if (disabled || !isActive || boardWinner || (position !== null && gameState[boardIndex][position])) return;
    onHoverSquare?.(position);
  };

  const handleClick = (position: number) => {
    if (disabled || !isActive || boardWinner || gameState[boardIndex][position]) return;
    onPlay(boardIndex, position);
    onHoverSquare?.(null); // Reset hover state after making a move
  };

  const boardContent = (
    <div 
      className={`grid grid-cols-3 gap-1 ${className} relative ${
        !boardWinner ? "opacity-100" : "opacity-30"
      }`}
    >
      {Array(9).fill(null).map((_, index) => {
        const canPlay = isActive && !gameState[boardIndex][index] && !boardWinner && !disabled;
        const content = gameState[boardIndex][index];
        return (
          <div
            key={index}
            className={`h-8 w-8 sm:h-12 sm:w-12 border-2 transform transition-all duration-300 ease-in-out ${
              (isActive && !boardWinner && !gameWinner) ? colors[boardIndex].border : colors[boardIndex].inactiveBorder
            } flex items-center justify-center text-2xl sm:text-4xl ${
              canPlay ? "cursor-pointer sm:hover:scale-105" : "cursor-default"
            } ${
              canPlay ? colors[boardIndex].bg : ""
            } rounded-md`}
            onClick={() => canPlay && handleClick(index)}
            onMouseEnter={() => canPlay && handleHover(index)}
            onMouseLeave={() => canPlay && handleHover(null)}
          >
            <span className={`transform transition-transform duration-300 ease-in-out font-bold select-none ${
              content === 'X' ? 'text-violet-600' : content === 'O' ? 'text-sky-600' : ''
            }`}>
              {content}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative">
      {boardContent}
      {boardWinner && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-5xl sm:text-8xl font-bold transform transition-transform duration-300 ease-in-out ${
            boardWinner === 'X' ? 'text-violet-600' : 'text-sky-600'
          }`}>
            {boardWinner}
          </span>
        </div>
      )}
    </div>
  );
};