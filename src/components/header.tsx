import { ThemeToggle } from "@/components/theme-toggle";
import { siGithub } from "simple-icons";
import { Icon } from "lucide-react";
import { strawberry } from "@lucide/lab";

function GithubIcon({ size = 24, color }: { size?: number; color?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color || "currentColor"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{siGithub.title}</title>
      <path d={siGithub.path} />
    </svg>
  );
}

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
            className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {/* <Github className="size-5" /> */}
            <GithubIcon />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
