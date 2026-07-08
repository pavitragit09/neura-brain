"use client";

import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: "verified" | "pending_review" | "contradiction" | "completed" | string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const norm = status.toLowerCase();

  let styles = "bg-secondary text-foreground/80 border-border/30";
  let label = status.replace("_", " ").toUpperCase();

  if (norm === "verified" || norm === "active") {
    styles = "bg-emerald-500/10 border-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    label = "VERIFIED";
  } else if (norm === "indexing") {
    styles = "bg-primary/10 border-primary/10 text-primary animate-pulse";
    label = "INDEXING...";
  } else if (norm === "indexed") {
    styles = "bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    label = "SEARCH READY";
  } else if (norm === "generating_sop") {
    styles = "bg-violet-500/10 border-violet-500/10 text-violet-600 dark:text-violet-400 animate-pulse";
    label = "ENRICHING...";
  } else if (norm === "pending_review" || norm === "pending" || norm === "review_required") {
    styles = "bg-amber-500/10 border-amber-500/10 text-amber-600 dark:text-amber-400";
    label = "PENDING REVIEW";
  } else if (norm === "contradiction" || norm === "failed" || norm === "conflict") {
    styles = "bg-red-500/10 border-red-500/10 text-red-600 dark:text-red-400";
    label = norm === "failed" ? "SOP FAILED" : "CONTRADICTION";
  } else if (norm === "completed" || norm === "done") {
    styles = "bg-emerald-500/10 border-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    label = "COMPLETED";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-bold font-mono tracking-wide select-none leading-none",
        styles,
        className
      )}
    >
      {label}
    </span>
  );
}
