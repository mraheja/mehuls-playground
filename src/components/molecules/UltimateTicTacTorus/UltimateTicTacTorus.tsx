'use client'

import { TicTacToe } from "../TicTacToe/TicTacToe";
import { useState, useEffect, useRef } from "react";
import { UltimateTicTacToeProvider, useUltimateTicTacToe } from "@/contexts/UltimateTicTacToeContext";
import { UndoIcon, Share2Icon, CheckIcon, RefreshCwIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import JSConfetti from 'js-confetti';
import * as Dialog from '@radix-ui/react-dialog';
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
    <div className={`p-1 rounded-sm transform transition-all duration-300 ease-in-out ${colors[index]} 
    ${showDottedBorder ? "ring-opacity-100 sm:scale-[1.02]" : "ring-opacity-0"} ${isActive ? "sm:scale-[1.02]" : ""}`}>
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
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
            setShowTurnIndicator(true);
            setIsLoading(false);
            return prev;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [hasUrlState]);

  useEffect(() => {
    if (!confettiRef.current) {
      confettiRef.current = new JSConfetti();
    }

    if (gameWinner && gameWinner !== lastWinnerRef.current) {
      confettiRef.current.addConfetti({
        emojis: ['🎉', '🎊', '🏆'],
        emojiSize: 30,
        confettiNumber: 100,
      });
      lastWinnerRef.current = gameWinner;
    }
  }, [gameWinner]);

  const handleShare = () => {
    navigator.clipboard.writeText(getStateUrl());
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 2000);
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    window.location.href = window.location.pathname;
  };

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
    <div className="grid grid-cols-3 gap-1 sm:gap-3 w-[350px] sm:w-[500px] place-items-center">
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
    <div className="flex flex-col items-center gap-4 sm:gap-8">
      <div className="relative">
        <div className={`sm:w-full w-[370px] relative p-1 sm:p-2 rounded-xl transition-all duration-500 ${showTurnIndicator ? "bg-white shadow-sm" : ""}`}>
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
        <div className={`text-xl text-center sm:text-2xl font-bold bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-sm z-10 relative transition-opacity duration-500 ${
          showTurnIndicator ? "opacity-100" : "opacity-0"
        }`}>
          {gameWinner 
            ? `Player ${gameWinner} wins!`
            : gameState.every(board => board.every(cell => cell === null))
              ? <span>
                  <span className="hidden sm:inline">Welcome to </span>Ultimate Tic-Tac-Torus!
                </span>
              : <div className={`${
                currentTurn === 'X' ? 'text-violet-600' : 'text-sky-600'
              }`}>
                Player {currentTurn}&apos;s turn
              </div>
          }
        </div>
        <div className={`sm:absolute relative mt-6 sm:mt-0 left-1/2 -translate-x-1/2 sm:-bottom-7 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center transition-opacity duration-500 ${showTurnIndicator ? "opacity-100" : "opacity-0"}`}>
          <div className="flex gap-3">
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className={`sm:text-xs text-base font-medium sm:px-4 px-6 sm:py-2 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg
                      ${canUndo 
                        ? "bg-violet-50 hover:bg-violet-100 text-violet-700" 
                        : "bg-gray-50 text-gray-400 cursor-not-allowed"
                      } flex-1 sm:flex-none order-1`}
                  >
                    <span className="hidden sm:block">
                      <UndoIcon className={`h-4 w-4 ${canUndo ? "stroke-violet-700" : "stroke-gray-400"}`} />
                    </span>
                    <span className="sm:hidden">Undo</span>
                  </button>
                </Tooltip.Trigger>
                <div className="hidden sm:block">
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm z-50"
                      sideOffset={5}
                      side="bottom"
                      align="center"
                    >
                      Undo last move
                      <Tooltip.Arrow className="fill-white" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </div>
              </Tooltip.Root>

              <Dialog.Root open={showResetConfirm} onOpenChange={setShowResetConfirm}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Dialog.Trigger asChild>
                      <button
                        className="sm:text-xs text-base font-medium sm:px-4 px-6 sm:py-2 py-3 rounded-lg transition-colors duration-200 
                          bg-red-50 hover:bg-red-100 text-red-700 shadow-md hover:shadow-lg flex-1 sm:flex-none order-2"
                      >
                        <span className="hidden sm:block">
                          <RefreshCwIcon className="h-4 w-4 stroke-red-700" />
                        </span>
                        <span className="sm:hidden">Reset</span>
                      </button>
                    </Dialog.Trigger>
                  </Tooltip.Trigger>
                  <div className="hidden sm:block">
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm z-50"
                        sideOffset={5}
                        side="bottom"
                        align="center"
                      >
                        Reset game
                        <Tooltip.Arrow className="fill-white" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </div>
                </Tooltip.Root>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[100]" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg max-w-md w-[90%] focus:outline-none z-[101]">
                    <Dialog.Title className="text-lg font-bold mb-4">Reset Game</Dialog.Title>
                    <Dialog.Description className="text-gray-600 mb-6">
                      Are you sure you want to reset the game? This action cannot be undone.
                    </Dialog.Description>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="px-4 py-2 rounded-lg transition-colors duration-200 
                          bg-gray-100 hover:bg-gray-200 text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 rounded-lg transition-colors duration-200 
                          bg-red-600 hover:bg-red-700 text-white"
                      >
                        Reset
                      </button>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={handleShare}
                    className="sm:text-xs text-base font-medium sm:px-4 px-6 sm:py-2 py-3 rounded-lg transition-colors duration-200 
                      bg-sky-50 hover:bg-sky-100 text-sky-700 shadow-md hover:shadow-lg flex-1 sm:flex-none order-3"
                  >
                    <span className="hidden sm:block">
                      {showShareSuccess ? (
                        <CheckIcon className="h-4 w-4 stroke-sky-700" />
                      ) : (
                        <Share2Icon className="h-4 w-4 stroke-sky-700" />
                      )}
                    </span>
                    <span className="sm:hidden">
                      {showShareSuccess ? "Copied!" : "Share"}
                    </span>
                  </button>
                </Tooltip.Trigger>
                <div className="hidden sm:block">
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm z-50"
                      sideOffset={5}
                      side="bottom"
                      align="center"
                    >
                      {showShareSuccess ? "Copied!" : "Copy link to share"}
                      <Tooltip.Arrow className="fill-white" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </div>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
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
