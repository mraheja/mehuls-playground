'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface GameState {
  gameState: (string | null)[][];
  currentBoard: number | null;
  currentTurn: string;
  boardWinners: (string | null)[];
  gameWinner: string | null;
}

interface UltimateTicTacToeContextType extends GameState {
  onPlay: (boardIndex: number, position: number) => void;
  onUndo: () => void;
  getStateUrl: () => string;
  canUndo: boolean;
}

const UltimateTicTacToeContext = createContext<UltimateTicTacToeContextType | undefined>(undefined);

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

const checkWinner = (board: (string | null)[]) => {
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

// Encode game state to URL-friendly string
const encodeGameState = (state: GameState): string => {
  const { gameState, currentBoard } = state;
  // First 81 chars are the board state
  const boardState = gameState.map(board => 
    board.map(cell => cell === null ? '-' : cell).join('')
  ).join('');
  // Add current board at the end (- for null)
  return boardState + '_' + (currentBoard === null ? '-' : currentBoard);
};

// Decode URL string to game state
const decodeGameState = (encoded: string): (string | null)[][] | null => {
  const [boardState, currentBoard] = encoded.split('_');
  if (!boardState || boardState.length !== 81) return null;
  
  const result: (string | null)[][] = [];
  for (let i = 0; i < 9; i++) {
    const board: (string | null)[] = [];
    for (let j = 0; j < 9; j++) {
      const cell = boardState[i * 9 + j];
      board.push(cell === '-' ? null : cell);
    }
    result.push(board);
  }
  return result;
};

// Calculate all winners and next state from a game state
const calculateGameState = (boards: (string | null)[][], currentBoard: number | null): {
  boardWinners: (string | null)[],
  gameWinner: string | null,
  currentTurn: string,
  currentBoard: number | null
} => {
  // Calculate board winners
  const boardWinners = boards.map(board => checkWinner(board));
  
  // Calculate game winner
  const gameWinner = checkWinner(boardWinners);
  
  // Calculate current turn
  const moveCount = boards.flat().filter(cell => cell !== null).length;
  const currentTurn = moveCount % 2 === 0 ? 'X' : 'O';

  // Validate current board
  const isValidBoard = currentBoard !== null && 
    currentBoard >= 0 && 
    currentBoard < 9 &&
    !boardWinners[currentBoard] && 
    boards[currentBoard].some(cell => cell === null);
  
  return { 
    boardWinners, 
    gameWinner, 
    currentTurn,
    currentBoard: isValidBoard ? currentBoard : null
  };
};

const initialGameState: GameState = {
  gameState: Array(9).fill(null).map(() => Array(9).fill(null)),
  currentBoard: null,
  currentTurn: 'X',
  boardWinners: Array(9).fill(null),
  gameWinner: null,
};

export const UltimateTicTacToeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [history, setHistory] = useState<GameState[]>([initialGameState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load initial state from URL
  useEffect(() => {
    const state = searchParams.get('state');
    if (state) {
      const [boardState, currentBoardStr] = state.split('_');
      if (boardState) {
        const boards = decodeGameState(boardState);
        if (boards) {
          const currentBoard = currentBoardStr === '-' ? null : parseInt(currentBoardStr);
          const { boardWinners, gameWinner, currentTurn } = calculateGameState(boards, currentBoard);
          const newState: GameState = {
            gameState: boards,
            currentBoard,
            currentTurn,
            boardWinners,
            gameWinner,
          };
          setHistory([newState]);
          setCurrentIndex(0);
        }
      }
    }
  }, [searchParams]);

  // Current state is always the last state in our valid history
  const currentState = history[currentIndex];
  const { gameState, currentBoard, currentTurn, boardWinners, gameWinner } = currentState;

  const getStateUrl = useCallback(() => {
    const url = new URL(window.location.href);
    
    // Check if any moves have been made
    const hasAnyMoves = gameState.some(board => board.some(cell => cell !== null));
    
    if (hasAnyMoves) {
      url.searchParams.set('state', encodeGameState(currentState));
    } else {
      url.searchParams.delete('state');
    }
    
    return `${window.location.origin}${url.pathname}${url.search}`;
  }, [currentState, gameState]);

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
      getStateUrl,
      canUndo: currentIndex > 0,
    }}>
      {children}
    </UltimateTicTacToeContext.Provider>
  );
};

export const useUltimateTicTacToe = () => {
  const context = useContext(UltimateTicTacToeContext);
  if (!context) {
    throw new Error('useUltimateTicTacToe must be used within a UltimateTicTacToeProvider');
  }
  return context;
};