"use client";

import { ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivitySummaryProps = {
  todayEventsCount: number;
  totalUpdatesCount: number;
  pendingReviewsCount: number;
  auditChainValid: boolean;
};

export function ActivitySummary({
  todayEventsCount,
  totalUpdatesCount,
  pendingReviewsCount,
  auditChainValid,
}: ActivitySummaryProps) {
  const cards = [
    {
      label: "Today's Events",
      value: todayEventsCount.toString(),
      subtext: "Timeline actions today",
    },
    {
      label: "Knowledge Updates",
      value: totalUpdatesCount.toString(),
      subtext: "Successful ingestions",
    },
    {
      label: "Pending Reviews",
      value: pendingReviewsCount.toString(),
      subtext: "Awaiting human verification",
      attention: pendingReviewsCount > 0,
    },
    {
      label: "Audit Chain",
      value: auditChainValid ? "Verified" : "Mismatch",
      subtext: "Cryptographic hash check",
      badge: true,
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4 select-none">
      {cards.map((card, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/30 bg-card p-4 shadow-sm/5 flex flex-col justify-between gap-1.5"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 leading-none">
            {card.label}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            {card.badge ? (
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "text-sm font-medium tracking-tight leading-none",
                    auditChainValid ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                  )}
                >
                  {card.value}
                </span>
                {auditChainValid ? (
                  <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                ) : (
                  <ShieldAlert className="size-4 text-destructive shrink-0" />
                )}
              </div>
            ) : (
              <span
                className={cn(
                  "text-xl font-medium tracking-tight text-foreground/90 font-mono leading-none",
                  card.attention && "text-amber-600 dark:text-amber-500"
                )}
              >
                {card.value}
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground/75 leading-none mt-1">
            {card.subtext}
          </span>
        </div>
      ))}
    </div>
  );
}
