import { UltimateTicTacTorus } from "@/components/molecules/UltimateTicTacTorus/UltimateTicTacTorus";
import { Suspense } from "react";

const UltimateTicTacTorusPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[100dvh] overflow-clip bg-gray-100">
      <Suspense fallback={<div>Loading game...</div>}>
        <UltimateTicTacTorus />
      </Suspense>
    </div>
  );
};

export default UltimateTicTacTorusPage;
