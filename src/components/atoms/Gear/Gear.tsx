import { cn } from "@/lib/utils";

interface GearProps {
  width: number;
  numSpokes: number;
  spokeRadius: number;
  spokeSize: number;
  className?: string;
  offset?: number; // Angle offset in degrees
}

export const Gear = ({
  width,
  numSpokes,
  spokeRadius,
  spokeSize,
  className = "",
  offset = 0,
}: GearProps) => {
  return (
    <div
      className={cn(
        "relative bg-primary rounded-full border flex justify-center items-center",
        className
      )}
      style={{ width: width - spokeRadius, height: width - spokeRadius }}
    >
      <div className="rounded-full bg-background w-3 h-3 z-10" />
      {Array.from({ length: numSpokes }, (_, i) => (
        <div
          key={i}
          className={cn(
            "absolute bg-primary left-1/2 top-1/2 rounded-sm",
            className
          )}
          style={{
            width: width / 2,
            height: spokeSize,
            transformOrigin: "0 50%",
            transform: `translate(0%, -50%) rotate(${
              (360 / numSpokes) * i + offset
            }deg)`,
          }}
        />
      ))}
    </div>
  );
};
