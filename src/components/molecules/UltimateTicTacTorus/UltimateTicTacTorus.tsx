'use client'

import { TicTacToe } from "../TicTacToe/TicTacToe";
import { useState, useEffect, useRef } from "react";
import { UltimateTicTacToeProvider, useUltimateTicTacToe } from "@/contexts/UltimateTicTacToeContext";
import { UndoIcon, Share2Icon, CheckIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import JSConfetti from 'js-confetti';
import * as Tooltip from '@radix-ui/react-tooltip';

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
    "bg-rose-50",      // Modern pink-red
    "bg-sky-50",       // Fresh light blue
    "bg-emerald-50",   // Contemporary green
    "bg-violet-50",    // Trendy purple
    "bg-amber-50",     // Warm golden
    "bg-cyan-50",      // Modern turquoise
    "bg-fuchsia-50",   // Vibrant pink
    "bg-lime-50",      // Fresh lime
    "bg-orange-50"     // Bright orange
  ];

  return (
    <div className={`p-1 rounded-sm transition-all duration-200 ${colors[index]} 
    ${showDottedBorder ? "!ring-gray-300 ring-[1px]" : ""}`}>
      {children}
    </div>
  );
};

const GameBoard = () => {
  const { currentTurn, gameState, boardWinners, gameWinner, onUndo, getStateUrl, canUndo } = useUltimateTicTacToe();
  const [visibleBoards, setVisibleBoards] = useState(-1);
  const [showTurnIndicator, setShowTurnIndicator] = useState(false);
  const [hoveredMove, setHoveredMove] = useState<{board: number, position: number} | null>(null);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const confettiRef = useRef<JSConfetti | null>(null);
  const lastWinnerRef = useRef<string | null>(null);

  // Check if we're loading from a URL state
  const searchParams = useSearchParams();
  const hasUrlState = searchParams.has('state');

  useEffect(() => {
    if (hasUrlState) {
      // Skip animation if loading from URL
      setVisibleBoards(8);
      setShowTurnIndicator(true);
      setIsLoading(false);
    } else {
      // Do the normal animation
      const timer = setInterval(() => {
        setVisibleBoards(prev => {
          if (prev >= 8) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [hasUrlState]);

  useEffect(() => {
    if (!hasUrlState) {
      // Only do this animation if not loading from URL
      if (visibleBoards >= 8) {
        const timer = setTimeout(() => {
          setShowTurnIndicator(true);
          setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [visibleBoards, hasUrlState]);

  useEffect(() => {
    if (showShareSuccess) {
      const timer = setTimeout(() => setShowShareSuccess(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showShareSuccess]);

  useEffect(() => {
    confettiRef.current = new JSConfetti();
  }, []);

  useEffect(() => {
    if (gameWinner && gameWinner !== lastWinnerRef.current) {
      lastWinnerRef.current = gameWinner;
      confettiRef.current?.addConfetti({
        emojis: ['🎉', '🎊', '🏆'],
        emojiSize: 30,
        confettiNumber: 50,
      });
    }
  }, [gameWinner]);

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

  const handleShare = () => {
    navigator.clipboard.writeText(getStateUrl());
    setShowShareSuccess(true);
  };

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
        <div className={`relative p-2 rounded-xl transition-all duration-500 ${showTurnIndicator ? "bg-white shadow-sm " : ""}`}>
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
          <div className={`absolute left-1/2 -translate-x-1/2 -bottom-7 flex gap-2 ${showTurnIndicator ? "opacity-100" : "opacity-0"}`}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={onUndo}
                  className="text-xs font-medium px-3 py-1 rounded-b-lg transition-all duration-200 
                    bg-gray-400 text-gray-700 hover:bg-gray-700 shadow-sm -translate-y-2"
                >
                  <UndoIcon className="h-3 w-3 stroke-white" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="z-50 select-none rounded-lg bg-white px-3 py-2 text-sm leading-none shadow-md animate-in fade-in-0 zoom-in-95"
                  sideOffset={10}
                  side="bottom"
                >
                  Undo last move
                  <Tooltip.Arrow className="fill-white" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={handleShare}
                  className="text-xs font-medium px-3 py-1 rounded-b-lg transition-all duration-200 
                    bg-gray-400 text-gray-700 hover:bg-gray-700 shadow-sm -translate-y-2"
                >
                  {showShareSuccess ? (
                    <CheckIcon className="h-3 w-3 stroke-white" />
                  ) : (
                    <Share2Icon className="h-3 w-3 stroke-white" />
                  )}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="z-50 select-none rounded-lg bg-white px-3 py-2 text-sm leading-none shadow-md animate-in fade-in-0 zoom-in-95"
                  sideOffset={10}
                  side="bottom"
                >
                  {showShareSuccess ? "Copied!" : "Share game state"}
                  <Tooltip.Arrow className="fill-white" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
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
