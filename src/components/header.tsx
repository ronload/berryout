import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        <span className="text-lg font-semibold">BERRYOUT</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
