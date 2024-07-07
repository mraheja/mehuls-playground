import { LeafIcon } from "lucide-react";

const SWAYING_CSS = "animate-swaying";

export const Sprout = () => {
  return (
    <div className="sway-slow">
      <div className="flex flex-row sway-fast">
        <LeafIcon className="w-10 h-10 -scale-x-100 rotate-[6deg] -mx-[0.4rem] stroke-green-600" />
        <LeafIcon className="w-9 h-9 rotate-12 stroke-green-600" />
      </div>
      <div className="ml-[1.6rem] h-10 -my-[0.6rem] w-[0.27rem] rounded-md bg-green-600" />
    </div>
  );
};
