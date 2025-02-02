'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Player = "X" | "O";
type BoardState = (Player | null)[];
type GameState = BoardState[];

interface UltimateTicTacToeContextType {
  gameState: GameState;
  currentTurn: Player;
  onPlay: (boardIndex: number, position: number) => void;
  onUndo: () => void;
  canUndo: boolean;
  currentBoard: number | null;
  winner: Player | null;
  boardWinners: (Player | null)[];
  gameWinner: Player | null;
}

// Function to calculate relative position with torus wrapping
const getRelativePosition = (currentPos: number, movePos: number): number => {
  const currentRow = Math.floor(currentPos / 3);
  const currentCol = currentPos % 3;
  const moveRow = Math.floor(movePos / 3);
  const moveCol = movePos % 3;

  // Calculate relative movement with wrapping
  const newRow = (currentRow + moveRow - 1 + 3) % 3;
  const newCol = (currentCol + moveCol - 1 + 3) % 3;

  return newRow * 3 + newCol;
};

// Basic winning combinations (no wrapping)
const basicWinningCombinations = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

const checkWinner = (board: (Player | null)[]) => {
  // First check basic winning combinations
  for (const [a, b, c] of basicWinningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  // Then check toroidal winning combinations
  for (let startPos = 0; startPos < 9; startPos++) {
    for (let movePos = 0; movePos < 9; movePos++) {
      const pos1 = startPos;
      const pos2 = getRelativePosition(startPos, movePos);
      const pos3 = getRelativePosition(pos2, movePos);

      // Only check if it creates a valid line (3 different positions)
      if (pos1 !== pos2 && pos2 !== pos3 && pos1 !== pos3) {
        if (board[pos1] && board[pos1] === board[pos2] && board[pos1] === board[pos3]) {
          return board[pos1];
        }
      }
    }
  }

  return null;
};

const initialGameState: GameState = {
  gameState: Array(9).fill(null).map(() => Array(9).fill(null)),
  currentBoard: null,
  currentTurn: 'X',
  boardWinners: Array(9).fill(null),
  gameWinner: null,
};

export const UltimateTicTacToeContext = createContext<UltimateTicTacToeContextType>({
  gameState: Array(9).fill(null).map(() => Array(9).fill(null)),
  currentTurn: "X",
  onPlay: () => {},
  onUndo: () => {},
  canUndo: false,
  currentBoard: null,
  winner: null,
  boardWinners: Array(9).fill(null),
  gameWinner: null,
});

export const useUltimateTicTacToe = () => useContext(UltimateTicTacToeContext);

interface UltimateTicTacToeProviderProps {
  children: ReactNode;
}

export const UltimateTicTacToeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<GameState[]>([initialGameState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Current state is always the last state in our valid history
  const currentState = history[currentIndex];
  const { gameState, currentBoard, currentTurn, boardWinners, gameWinner } = currentState;

  const onUndo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const onPlay = useCallback((boardIndex: number, position: number) => {
    if (gameWinner) return;
    
    if (
      (currentBoard !== null && currentBoard !== boardIndex) ||
      gameState[boardIndex][position] ||
      boardWinners[boardIndex]
    ) {
      return;
    }

    const newGameState = [...gameState];
    newGameState[boardIndex] = [...gameState[boardIndex]];
    newGameState[boardIndex][position] = currentTurn;

    const winner = checkWinner(newGameState[boardIndex]);
    const newBoardWinners = [...boardWinners];
    if (winner) {
      newBoardWinners[boardIndex] = winner;
    }

    // Calculate next board using toroidal movement
    const nextBoard = getRelativePosition(boardIndex, position);

    // If target board is won or full, allow playing anywhere
    const isTargetBoardWon = newBoardWinners[nextBoard] !== null;
    const isTargetBoardFull = !newGameState[nextBoard].includes(null);
    
    const newState: GameState = {
      gameState: newGameState,
      currentBoard: isTargetBoardWon || isTargetBoardFull ? null : nextBoard,
      currentTurn: currentTurn === 'X' ? 'O' : 'X',
      boardWinners: newBoardWinners,
      gameWinner: winner ? checkWinner(newBoardWinners) : null,
    };

    // Add new state to history, removing any future states if we had undone
    setHistory(history.slice(0, currentIndex + 1).concat([newState]));
    setCurrentIndex(currentIndex + 1);
  }, [currentBoard, currentTurn, gameState, boardWinners, gameWinner, history, currentIndex]);

  return (
    <UltimateTicTacToeContext.Provider value={{
      ...currentState,
      onPlay,
      onUndo,
      canUndo: currentIndex > 0,
    }}>
      {children}
    </UltimateTicTacToeContext.Provider>
  );
};