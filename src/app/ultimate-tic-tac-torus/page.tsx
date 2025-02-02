import { UltimateTicTacTorus } from "@/components/molecules/UltimateTicTacTorus/UltimateTicTacTorus";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ultimate Tic Tac Torus",
  description: "A combination of Ultimate Tic-Tac-Toe and Tic-Tac-Torus - a challenging strategic game where boards wrap around like a donut!",
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
  </div>
);

const UltimateTicTacTorusPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[100dvh] overflow-clip bg-gray-100">
      <Suspense fallback={<LoadingSpinner />}>
        <>
          <Link href="/ultimate-tic-tac-torus/rules" className="absolute top-4 right-4 z-10">
            <Button variant="outline">Rules</Button>
          </Link>
          <UltimateTicTacTorus />
        </>
      </Suspense>
    </div>
  );
};

export default UltimateTicTacTorusPage;
