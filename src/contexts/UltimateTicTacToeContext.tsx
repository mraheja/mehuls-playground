'use client'

import { createContext, useContext, useState, ReactNode } from "react";

type Player = "X" | "O";
type BoardState = (Player | null)[];
type GameState = BoardState[];

interface UltimateTicTacToeContextType {
  gameState: GameState;
  currentTurn: Player;
  onPlay: (boardIndex: number, position: number) => void;
  currentBoard: number | null;
  winner: Player | null;
  boardWinners: (Player | null)[];
}

const calculateWinner = (squares: (Player | null)[]): Player | null => {
  // Standard win conditions
  const standardLines = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal
    [2, 4, 6], // Diagonal
  ];

  // Torus-style wrapping win conditions
  const torusLines = [
    // Wrapping rows
    [2, 0, 1],
    [5, 3, 4],
    [8, 6, 7],
    // Wrapping columns
    [6, 0, 3],
    [7, 1, 4],
    [8, 2, 5],
    // Wrapping diagonals
    [6, 4, 2], // Bottom-left to top-right wrapping
    [8, 4, 0], // Bottom-right to top-left wrapping
    [2, 4, 6], // Top-right to bottom-left wrapping
    [0, 4, 8], // Top-left to bottom-right wrapping
    // Additional broken diagonals
    [1, 5, 0], // Top-middle, right-middle, top-left wrap
    [5, 0, 4], // Right-middle, top-left, center wrap
    [3, 7, 2], // Left-middle, bottom-middle, top-right wrap
    [7, 2, 4], // Bottom-middle, top-right, center wrap
    [1, 3, 8], // Top-middle, left-middle, bottom-right wrap
    [3, 8, 4], // Left-middle, bottom-right, center wrap
    [5, 7, 6], // Right-middle, bottom-middle, bottom-left wrap
    [7, 6, 4], // Bottom-middle, bottom-left, center wrap
  ];

  // Check all win conditions
  const allLines = [...standardLines, ...torusLines];
  
  for (const [a, b, c] of allLines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
};

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

export const UltimateTicTacToeContext = createContext<UltimateTicTacToeContextType>({
  gameState: Array(9).fill(Array(9).fill(null)),
  currentTurn: "X",
  onPlay: () => {},
  currentBoard: null,
  winner: null,
  boardWinners: Array(9).fill(null),
});

export const useUltimateTicTacToe = () => useContext(UltimateTicTacToeContext);

interface UltimateTicTacToeProviderProps {
  children: ReactNode;
}

export const UltimateTicTacToeProvider = ({ children }: UltimateTicTacToeProviderProps) => {
  const [gameState, setGameState] = useState<GameState>(
    Array(9).fill(null).map(() => Array(9).fill(null))
  );
  const [currentTurn, setCurrentTurn] = useState<Player>("X");
  const [currentBoard, setCurrentBoard] = useState<number | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [boardWinners, setBoardWinners] = useState<(Player | null)[]>(Array(9).fill(null));

  const onPlay = (boardIndex: number, position: number) => {
    if (winner || 
        (currentBoard !== null && currentBoard !== boardIndex) || 
        gameState[boardIndex][position] ||
        boardWinners[boardIndex]) {
      return;
    }

    const newGameState = gameState.map((board, index) => 
      index === boardIndex 
        ? board.map((cell, cellIndex) => 
            cellIndex === position ? currentTurn : cell
          )
        : [...board]
    );

    setGameState(newGameState);
    setCurrentTurn(currentTurn === "X" ? "O" : "X");
    
    // Check if the current board has a winner
    const newBoardWinner = calculateWinner(newGameState[boardIndex]);
    if (newBoardWinner) {
      const newBoardWinners = [...boardWinners];
      newBoardWinners[boardIndex] = newBoardWinner;
      setBoardWinners(newBoardWinners);
      
      // Check if this creates a winner for the entire game
      const gameWinner = calculateWinner(newBoardWinners);
      if (gameWinner) {
        setWinner(gameWinner);
        return;
      }
    }

    // Calculate next board based on relative position
    // If position is center (4), stay in the same board
    if (position === 4) {
      const targetBoard = boardWinners[boardIndex] || !newGameState[boardIndex].includes(null) 
        ? null  // If current board is won or full, allow playing anywhere
        : boardIndex;  // Stay in the same board
      setCurrentBoard(targetBoard);
    } else {
      const nextBoard = getRelativeBoard(boardIndex, position);
      // If target board is won or full, allow playing anywhere
      const isTargetBoardWon = boardWinners[nextBoard] !== null;
      const isTargetBoardFull = !newGameState[nextBoard].includes(null);
      setCurrentBoard(isTargetBoardWon || isTargetBoardFull ? null : nextBoard);
    }
  };

  return (
    <UltimateTicTacToeContext.Provider
      value={{
        gameState,
        currentTurn,
        onPlay,
        currentBoard,
        winner,
        boardWinners,
      }}
    >
      {children}
    </UltimateTicTacToeContext.Provider>
  );
};