import { cn } from "@/lib/utils";

type NeuraLogoProps = {
  collapsed?: boolean;
  className?: string;
};

export function NeuraLogo({ collapsed = false, className }: NeuraLogoProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-sm overflow-hidden border border-border/10">
        <span className="font-mono text-[11px] font-bold tracking-tight select-none">N</span>
        {/* Subtle premium light sheen overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-white/10 opacity-70" />
      </div>
      {!collapsed ? (
        <div className="min-w-0 flex flex-col leading-none">
          <span className="text-[13px] font-semibold tracking-tight text-foreground">NEURA</span>
          <span className="text-[9px] font-medium tracking-widest text-muted-foreground/75 mt-0.5">SYSTEM</span>
        </div>
      ) : null}
    </div>
  );
}

