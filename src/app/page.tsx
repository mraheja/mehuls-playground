import { Button } from "@/components/ui/button";
import { PAGES } from "../constant/pages";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-muted">
      <a href={PAGES.EYE_TRACKER}>
        <Button>Eye Tracker</Button>
      </a>
    </main>
  );
}
