'use client'

import { useUltimateTicTacToe } from "@/contexts/UltimateTicTacToeContext";

export interface TicTacToeProps {
    boardIndex: number;
    className?: string;
}

export const TicTacToe: React.FC<TicTacToeProps> = ({
    boardIndex,
    className,
}) => {
    const { gameState, onPlay, currentBoard, currentTurn, boardWinners } = useUltimateTicTacToe();
    const isActive = currentBoard === null || currentBoard === boardIndex;
    const boardWinner = boardWinners[boardIndex];

    if (boardWinner) {
        return (
            <div className="w-[150px] h-[150px] flex items-center justify-center">
                <span className="text-6xl font-bold text-indigo-600">{boardWinner}</span>
            </div>
        );
    }

    return (
        <div 
            className={`grid grid-cols-3 gap-1 ${className} ${
                isActive ? "opacity-100" : "opacity-50"
            }`}
        >
            {Array(9).fill(null).map((_, index) => (
                <div
                    key={index}
                    className={`h-12 w-12 border-2 ${
                        isActive ? "border-gray-600" : "border-gray-300"
                    } flex items-center justify-center text-4xl cursor-pointer rounded-md ${
                        isActive && !gameState[boardIndex][index] ? "hover:bg-gray-100" : ""
                    }`}
                    onClick={() => isActive && onPlay(boardIndex, index)}
                >
                    {gameState[boardIndex][index]}
                </div>
            ))}
        </div>
    );
};