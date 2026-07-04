"use client";

import { ShieldAlert } from "lucide-react";

export function TrustEmpty() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/40 rounded-xl bg-card/45 select-none">
      <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
        <ShieldAlert className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-medium text-foreground/90 tracking-tight">Queue Verification Clear</h3>
      <p className="text-xs text-muted-foreground/75 mt-1 max-w-[280px] leading-relaxed">
        All generated knowledge assets are successfully verified and synced. No SOPs require human review.
      </p>
    </div>
  );
}
