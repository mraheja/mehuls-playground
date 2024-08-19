import { isMobileDevice } from "@/utils/isMobileDevice";
import { PinkyPromise } from "./client";

const PinkyPromiseServer = async () => {
  const isMobile = await isMobileDevice();

  if (isMobile) {
    return (
      <div className="flex justify-center items-center min-h-[100dvh]">
        Unavailable on mobile {":("}
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center min-h-[100dvh]">
      <PinkyPromise />
    </div>
  );
};

export default PinkyPromiseServer;
