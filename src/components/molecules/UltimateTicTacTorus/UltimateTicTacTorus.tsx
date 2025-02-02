import { TicTacToe } from "../TicTacToe/TicTacToe";

export interface UltimateTicTacTorusProps {
  className?: string;
}

export const UltimateTicTacTorus: React.FC<UltimateTicTacTorusProps> = ({
  className,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array(9).fill(null).map((_, index) => (
        <div className="border-2 border-black p-1" key={index}>
            <TicTacToe/>
        </div>
      ))}
    </div>
  );
};