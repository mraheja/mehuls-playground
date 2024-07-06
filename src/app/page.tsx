import { Button } from "@/components/ui/button";
import { PAGES } from "../constant/pages";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-y-3 p-24 bg-muted">
      <a href={PAGES.EYE_TRACKER}>
        <Button>Eye Tracker</Button>
      </a>
      <a href={PAGES.SCROLL_GEAR}>
        <Button>Scroll Gear</Button>
      </a>
      <a href={PAGES.INFINITE_GIRAFFE}>
        <Button>Infinite Giraffe</Button>
      </a>
    </main>
  );
}
