import { ThemeToggle } from "@/components/theme-toggle";

import { Github, Icon } from "lucide-react";
import { strawberry } from "@lucide/lab";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        <span className="text-lg font-semibold flex gap-2">
          <Icon iconNode={strawberry} />
          BERRYOUT
        </span>
        <div className="flex items-center gap-1">
          <a
            href="https://github.com/ronload/berryout"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Github className="size-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
