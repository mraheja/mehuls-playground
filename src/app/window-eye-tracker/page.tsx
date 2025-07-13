import { TrackingEye } from "@/components/molecules/TrackingEye/TrackingEye";
import { WindowTrackingEye } from "@/components/molecules/WindowTrackingEye/WindowTrackingEye";
import { isMobileDevice } from "@/utils/isMobileDevice";

const WindowEyeTracker = async () => {
  const isMobile = await isMobileDevice();

  console.log(isMobile);

  return (
    <div className="w-full h-[100dvh] flex justify-center items-center gap-x-2">
      <WindowTrackingEye />
      {isMobile && <span className="absolute bottom-3">Touch anywhere</span>}
    </div>
  );
};

export default WindowEyeTracker;
