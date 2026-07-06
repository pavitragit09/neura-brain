"use client";

import { FileText, Waypoints, HelpCircle } from "lucide-react";
import type { DocumentItem, SOPItem } from "@/types/knowledge";
import { formatDateTime } from "@/lib/date";
import { memo } from "react";
import { StatusBadge } from "@/components/ui/status-badge";

type KnowledgeCardProps = {
  document: DocumentItem;
  sop?: SOPItem;
  viewMode?: "grid" | "list";
  onClick?: () => void;
};

export const KnowledgeCard = memo(function KnowledgeCard({
  document,
  sop,
  viewMode = "grid",
  onClick,
}: KnowledgeCardProps) {
  // Determine verification state
  const status = sop?.review_status ?? "PENDING";
  const confidence = sop?.confidence_score ?? 0;
  
  // Format last updated
  const formattedDate = formatDateTime(document.created_at);

  const isList = viewMode === "list";

  const getBadgeStatus = (statusStr: string) => {
    switch (statusStr.toUpperCase()) {
      case "APPROVED":
      case "AUTO_PUBLISH":
        return "verified";
      case "HUMAN_REVIEW":
      case "PENDING":
        return "pending_review";
      default:
        return "contradiction";
    }
  };

  const badgeStatus = getBadgeStatus(status);

  if (isList) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
        aria-label={`Inspect document ${document.filename}. Status: ${badgeStatus}. Source type: ${document.source_type}`}
        className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/30 bg-card p-4 shadow-sm/5 hover:-translate-y-0.5 hover:shadow-md/5 transition-all duration-150 ease-out cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/70 border border-border/20 text-muted-foreground/80 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors duration-150">
            {document.source_type === "pdf" ? (
              <FileText className="size-4" />
            ) : (
              <Waypoints className="size-4" />
            )}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <h4 className="truncate text-[13px] font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-150">
              {document.filename}
            </h4>
            <p className="truncate text-[11px] text-muted-foreground/85 mt-1">
              Source: {document.source_type.toUpperCase()} · Updated {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          {confidence > 0 && (
            <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/5 select-none">
              {confidence}% trust
            </span>
          )}
          <StatusBadge status={badgeStatus} />
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Inspect document ${document.filename}. Status: ${badgeStatus}. Confidence: ${confidence} percent`}
      className="group flex flex-col gap-4 rounded-xl border border-border/30 bg-card p-5 shadow-sm/5 hover:-translate-y-0.5 hover:shadow-md/5 transition-all duration-150 ease-out cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/70 border border-border/20 text-muted-foreground/80 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors duration-150">
          {document.source_type === "pdf" ? (
            <FileText className="size-4" />
          ) : (
            <Waypoints className="size-4" />
          )}
        </div>
        <StatusBadge status={badgeStatus} />
      </div>

      {/* Info block */}
      <div className="space-y-1.5 leading-tight flex-1">
        <h4 className="line-clamp-2 text-[13px] font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-150">
          {document.filename}
        </h4>
        <p className="text-[11px] text-muted-foreground/80">
          Format: {document.source_type.toUpperCase()}
        </p>
      </div>

      {/* Footer metadata */}
      <div className="mt-2 pt-3 border-t border-border/15 flex items-center justify-between text-[10px] text-muted-foreground/80 leading-none">
        <span>{formattedDate}</span>
        {confidence > 0 ? (
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/5">
            {confidence}% trust
          </span>
        ) : (
          <span className="flex items-center gap-1 font-mono text-muted-foreground/60">
            <HelpCircle className="size-3" />
            no score
          </span>
        )}
      </div>
    </div>
  );
});
