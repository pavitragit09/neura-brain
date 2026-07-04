"use client";

import { Link2Off } from "lucide-react";

type ConnectorEmptyProps = {
  searchQuery: string;
};

export function ConnectorEmpty({ searchQuery }: ConnectorEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/40 rounded-xl bg-card/45 select-none">
      <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/60 border border-border/20 text-muted-foreground/80 mb-4">
        <Link2Off className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-medium text-foreground/90 tracking-tight">No Connectors Found</h3>
      <p className="text-xs text-muted-foreground/75 mt-1 max-w-[280px] leading-relaxed">
        No integration channels matched your filter criteria for &ldquo;{searchQuery}&rdquo;.
      </p>
    </div>
  );
}
