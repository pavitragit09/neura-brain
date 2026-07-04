"use client";

import type { TrustSummary } from "@/types/knowledge";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type TrustHealthProps = {
  summary: TrustSummary;
};

export function TrustHealth({ summary }: TrustHealthProps) {
  const cards = [
    {
      label: "Verified Assets",
      value: summary.verified_assets_count.toString(),
      subtext: "Synced to context graph",
    },
    {
      label: "Review Queue",
      value: summary.pending_review_count.toString(),
      subtext: "SOPs awaiting validation",
      attention: summary.pending_review_count > 0,
    },
    {
      label: "Failed Ingestions",
      value: summary.failed_ingestion_count.toString(),
      subtext: "Needs parsing updates",
      danger: summary.failed_ingestion_count > 0,
    },
    {
      label: "Average Confidence",
      value: `${summary.average_confidence}%`,
      subtext: "AI extraction trust rate",
    },
    {
      label: "Cryptographic Log",
      value: summary.audit_chain_valid ? "Verified" : "Mismatch",
      subtext: "Blockchain audit chain",
      badge: true,
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 select-none">
      {cards.map((card, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/30 bg-card p-4.5 shadow-sm/5 flex flex-col justify-between gap-1.5"
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
                    summary.audit_chain_valid ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                  )}
                >
                  {card.value}
                </span>
                {summary.audit_chain_valid ? (
                  <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                ) : (
                  <ShieldAlert className="size-4 text-destructive shrink-0" />
                )}
              </div>
            ) : (
              <span
                className={cn(
                  "text-xl font-medium tracking-tight text-foreground/90 font-mono leading-none",
                  card.attention && "text-amber-600 dark:text-amber-500",
                  card.danger && "text-destructive"
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
