import { Command, Search } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type SearchInputProps = Omit<React.ComponentProps<"input">, "size"> & {
  showShortcut?: boolean;
  size?: "default" | "hero";
};

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, showShortcut = true, size = "default", disabled, ...props }, ref) => {
    const isHero = size === "hero";

    return (
      <div className={cn("relative flex w-full items-center", isHero && "h-14 sm:h-16")}>
        <Search
          className={cn(
            "pointer-events-none absolute text-muted-foreground/60 transition-colors duration-150 z-10",
            isHero ? "left-4.5 size-[18px] sm:left-5" : "left-3 size-3.5",
          )}
          aria-hidden="true"
        />
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            "flex w-full bg-card text-foreground placeholder:text-muted-foreground/65 outline-none transition-all duration-200 border",
            isHero
              ? "h-14 rounded-xl border-border/40 pl-12 text-sm shadow-md/5 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 sm:h-16 sm:pl-14 sm:text-[15px] sm:shadow-lg/5"
              : "h-9 rounded-lg border-border/45 pl-9 text-xs shadow-sm/5 focus:border-primary/40 focus:ring-4 focus:ring-primary/5",
            showShortcut && isHero && "sm:pr-24",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
          {...props}
        />
        {showShortcut && isHero && !disabled ? (
          <kbd className="pointer-events-none absolute right-4 hidden items-center gap-1 select-none rounded border border-border/40 bg-muted/65 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground/75 sm:inline-flex">
            <Command className="size-2.5" aria-hidden="true" />
            <span>K</span>
          </kbd>
        ) : null}
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";
