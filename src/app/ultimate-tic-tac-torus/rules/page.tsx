import { Button } from "@/components/ui/button";
import Link from "next/link";

const UTTTRules = () => {
  return (
    <div className="flex justify-center items-center min-h-[100dvh] flex-col space-y-2">
      <h1 className="text-3xl font-bold">Rules</h1>
      <Link href="/ultimate-tic-tac-torus">
        <Button variant="outline">Return to game</Button>
      </Link>
    </div>
  );
};

export default UTTTRules;
