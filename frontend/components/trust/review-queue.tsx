"use client";

import type { SOPItem } from "@/types/knowledge";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

import { formatDateTime } from "@/lib/date";

type ReviewQueueProps = {
  sops: SOPItem[];
  onInspect: (sop: SOPItem) => void;
};

export function ReviewQueue({ sops, onInspect }: ReviewQueueProps) {
  if (sops.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between select-none">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80 px-0.5">
          Review Queue
        </h3>
        <span className="text-[10px] text-muted-foreground/60 font-mono">
          {sops.length} Awaiting Verification
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {sops.map((sop) => {
          const formattedDate = formatDateTime(sop.created_at);

          return (
            <div
              key={sop.id}
              role="button"
              tabIndex={0}
              onClick={() => onInspect(sop)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onInspect(sop);
                }
              }}
              aria-label={`Pending review document ${sop.document_name}. Confidence: ${sop.confidence_score} percent.`}
              className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/30 bg-card p-4 shadow-sm/5 hover:-translate-y-0.5 hover:shadow-md/5 transition-all duration-150 ease-out cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              {/* Left Column */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/70 border border-border/20 text-muted-foreground/80 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors duration-150">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0 flex-1 leading-tight">
                  <h4 className="truncate text-[13px] font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-150">
                    {sop.document_name}
                  </h4>
                  <p className="truncate text-[11px] text-muted-foreground/85 mt-1">
                    Uploaded {formattedDate} · Ingestion confidence: {sop.confidence_score}%
                  </p>
                </div>
              </div>

              {/* Right Column Actions/Tags */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/5 select-none">
                  {sop.confidence_score}% confidence
                </span>
                
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-6.5 text-[10px] px-2.5 rounded bg-secondary hover:bg-secondary/80 text-foreground cursor-pointer select-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspect(sop);
                  }}
                >
                  Inspect
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
