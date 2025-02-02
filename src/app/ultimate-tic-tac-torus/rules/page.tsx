import { Button } from "@/components/ui/button";
import Link from "next/link";

const UTTTRules = () => {
  return (
    <div className="flex justify-center items-center min-h-[100dvh]">
      <div className="flex flex-col space-y-2 max-w-2xl items-center">
        <h1 className="text-3xl font-bold mb-4 mt-6">Rules</h1>
        <div className="space-y-2 mt-2">
          <p>
            This game is a combination of{" "}
            <a
              href="https://www.thegamegal.com/2018/09/01/ultimate-tic-tac-toe/"
              className="text-blue-600 hover:underline"
            >
              Ultimate Tic-Tac-Toe
            </a>{" "}
            and{" "}
            <a
              href="https://jpanuelos.com/2017/02/12/TicTacTorus.html"
              className="text-blue-600 hover:underline"
            >
              Tic-Tac-Torus
            </a>
          </p>
          <p>
            To win, just like Ultimate Tic-Tac-Toe, the player must get 3 of
            their symbols in a row, column, or diagonal in the larger grid:
          </p>
          <div className="flex justify-center">
            <img src="/uttt/win.png" alt="Ultimate Tic-Tac-Torus win condition" className="my-4 max-w-md h-auto rounded-md" />
          </div>

          <p>
            However, your diagonals are also valid if they create three in a
            row on a torus (when the grid wraps around):
          </p>
          <div className="flex justify-center">
            <img src="/uttt/toruswin.png" alt="Ultimate Tic-Tac-Torus win condition" className="my-4 max-w-md h-auto rounded-md" />
          </div>
          <p>
            Each individual smaller grid is treated the same, where any three
            in a row (standard or torus) counts as a win:
          </p>
          <div className="flex justify-center">
            <img src="/uttt/smallwin.png" alt="Ultimate Tic-Tac-Torus win condition" className="my-4 max-w-sm h-auto rounded-md" />
          </div>
          <p>
            The smaller grid you can move in is determined by the square that
            your opponent played in their last turn. Unlike Ultimate Tic-Tac-Toe, the
            positioning is relative, so if your opponent plays on the top
            right square of their smaller grid, you can only move in the smaller
            grid that is located above and to the right of their grid (on a torus).
            If the opponent plays in the center, you stay on the same grid.
          </p>
          <div className="flex justify-center space-x-4">
            <img src="/uttt/move1.png" alt="First move in Ultimate Tic-Tac-Torus" className="my-4 max-w-xs h-auto rounded-md" />
            <img src="/uttt/move2.png" alt="Second move in Ultimate Tic-Tac-Torus" className="my-4 max-w-xs h-auto rounded-md" />
          </div>
          <p>
            If the grid you were placed on is already won, you can place your symbol
            anywhere on the board.
          </p>
          <p className="italic">
            As an exercise to the reader, prove that this game cannot end in a 
            draw.
          </p>
        </div>
        <Link href="/ultimate-tic-tac-torus">
          <Button variant="outline" className="mt-3 mb-10">
            Return to game
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UTTTRules;
