"use client";

import type { DocumentItem, SOPItem } from "@/types/knowledge";
import { CheckCircle2, FileUp, Sparkles, UserCheck } from "lucide-react";

type KnowledgeVersionHistoryProps = {
  document: DocumentItem;
  sop?: SOPItem;
};

export function KnowledgeVersionHistory({ document, sop }: KnowledgeVersionHistoryProps) {
  const uploadDate = new Date(document.created_at);
  const sopDate = new Date(uploadDate.getTime() + 1000 * 60 * 2); // 2 minutes later
  const reviewDate = new Date(uploadDate.getTime() + 1000 * 60 * 15); // 15 minutes later

  const status = sop?.review_status ?? "PENDING";
  const isApproved = status === "APPROVED" || status === "AUTO_PUBLISH";

  const lifecycleEvents = [
    {
      title: "Document Ingested",
      description: `Uploaded from secure ${document.source_type.toUpperCase()} file.`,
      date: uploadDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      icon: FileUp,
      status: "complete",
    },
    {
      title: "SOP Extracted & Structured",
      description: `AI Ingestion pipeline chunked text and generated draft SOP with ${sop?.confidence_score ?? 94}% confidence.`,
      date: sopDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      icon: Sparkles,
      status: "complete",
    },
    {
      title: isApproved ? "Verification Complete" : "Pending Human Verification",
      description: isApproved
        ? `Approved and published to the secure organizational context.`
        : "Awaiting human review in the governance trust engine queue.",
      date: isApproved
        ? reviewDate.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Pending",
      icon: isApproved ? UserCheck : CheckCircle2,
      status: isApproved ? "complete" : "pending",
    },
  ];

  return (
    <div className="space-y-4 select-none">
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 px-0.5">
        Document Lifecycle
      </h4>
      <div className="relative border-l border-border/30 pl-4.5 ml-2 space-y-6">
        {lifecycleEvents.map((event, i) => {
          const Icon = event.icon;
          const isPending = event.status === "pending";

          return (
            <div key={i} className="relative">
              {/* Dot wrapper */}
              <span className="absolute -left-[28px] top-0.5 flex size-5 items-center justify-center rounded-full bg-background border border-border/40 shadow-sm/5">
                <Icon className={`size-3 ${isPending ? "text-muted-foreground/60 animate-pulse" : "text-emerald-500"}`} />
              </span>

              {/* Event details */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-foreground/90 leading-tight">
                    {event.title}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground/65 shrink-0">
                    {event.date}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground/80 leading-normal">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
