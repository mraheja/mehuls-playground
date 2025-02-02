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
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
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