import { TicTacToe } from "../TicTacToe/TicTacToe";

export interface UltimateTicTacTorusProps {
  className?: string;
}

export const UltimateTicTacTorus: React.FC<UltimateTicTacTorusProps> = ({
  className,
}) => {
  const board = (
    <div className="grid grid-cols-3 gap-3 w-[500px] place-items-center">
      {Array(9)
        .fill(null)
        .map((_, index) => (
          <div className="border-2 border-black p-1" key={index}>
            <TicTacToe />
          </div>
        ))}
    </div>
  );


  return (
    <div className="relative">
      {board}
      <div className="absolute top-0 left-full opacity-30 translate-x-3">{board}</div>
      <div className="absolute top-0 right-full opacity-30 -translate-x-3">{board}</div>
      <div className="absolute bottom-full left-0 opacity-30 -translate-y-3">{board}</div>
      <div className="absolute top-full left-0 opacity-30 translate-y-3">{board}</div>
      <div className="absolute top-full right-full opacity-30 translate-y-3 -translate-x-3">{board}</div>
      <div className="absolute bottom-full right-full opacity-30 -translate-y-3 -translate-x-3">{board}</div>
      <div className="absolute top-full left-full opacity-30 translate-y-3 translate-x-3">{board}</div>
      <div className="absolute bottom-full left-full opacity-30 -translate-y-3 translate-x-3">{board}</div>
    </div>
  );
};
