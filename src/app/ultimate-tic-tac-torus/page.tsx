import { UltimateTicTacTorus } from "@/components/molecules/UltimateTicTacTorus/UltimateTicTacTorus";
import { Suspense } from "react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
  </div>
);

const UltimateTicTacTorusPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[100dvh] overflow-clip bg-gray-100">
      <Suspense fallback={<LoadingSpinner />}>
        <UltimateTicTacTorus />
      </Suspense>
    </div>
  );
};

export default UltimateTicTacTorusPage;
