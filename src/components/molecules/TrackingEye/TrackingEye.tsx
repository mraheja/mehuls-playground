import { useRef, useEffect } from "react";

export const TrackingEye = () => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCursor = ({ x, y }: { x: number; y: number }): void => {
      const eyeBounds = eyeRef.current?.getBoundingClientRect();
      const irisBounds = irisRef.current?.getBoundingClientRect();
      if (!eyeBounds || !irisBounds) return;

      // Calculate the angle between cursor and position of eye1
      const angle = Math.atan2(y - eyeBounds.y, x - eyeBounds.x);

      // Find the distance between the center of the eye and center of the iris.
      const radius = eyeBounds.width / 2 - irisBounds.width / 2;

      // Calculate center of iris
      const centerX = radius * Math.cos(angle);
      const centerY = radius * Math.sin(angle);

      // Set position of iris
      if (irisRef.current) {
        irisRef.current.style.transform = `translate(${centerX}px, ${centerY}px)`;
      }
    };

    document.body.addEventListener("pointermove", updateCursor);
  }, [eyeRef, irisRef]);

  return (
    <div
      className="rounded-full w-6 h-6 border border-black flex justify-center items-center"
      ref={eyeRef}
    >
      <div className="rounded-full w-3 h-3 bg-black" ref={irisRef} />
    </div>
  );
};
