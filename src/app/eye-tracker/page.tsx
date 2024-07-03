import { TrackingEye } from "@/components/molecules/TrackingEye/TrackingEye";
import { isMobileDevice } from "@/utils/isMobileDevice";

const EyeTracker = async () => {
  const isMobile = await isMobileDevice();

  console.log(isMobile);

  return (
    <div className="w-full h-[100dvh] flex justify-center items-center gap-x-2">
      <TrackingEye />
      <TrackingEye />
      {isMobile && <span className="absolute bottom-3">Touch anywhere</span>}
    </div>
  );
};

export default EyeTracker;
