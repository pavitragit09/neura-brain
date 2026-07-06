"use client";

import { cn } from "@/lib/utils";

type ActivityStatusProps = {
  status: string;
};

export function ActivityStatus({ status }: ActivityStatusProps) {
  const getStyle = (s: string) => {
    const norm = s.toLowerCase();
    if (norm.includes("completed") || norm.includes("approved") || norm.includes("verified") || norm.includes("success")) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10";
    }
    if (norm.includes("rejected") || norm.includes("failed") || norm.includes("conflict")) {
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/10";
    }
    if (norm.includes("pending") || norm.includes("review") || norm.includes("requested")) {
      return "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/10";
    }
    return "bg-secondary text-foreground border-border/10";
  };

  return (
    <span
      className={cn(
        "text-[9px] font-mono font-medium tracking-wide uppercase px-1.5 py-0.5 rounded border select-none",
        getStyle(status)
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
