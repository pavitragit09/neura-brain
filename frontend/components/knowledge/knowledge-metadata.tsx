"use client";

import type { DocumentItem, SOPItem } from "@/types/knowledge";

type KnowledgeMetadataProps = {
  document: DocumentItem;
  sop?: SOPItem;
};

export function KnowledgeMetadata({ document, sop }: KnowledgeMetadataProps) {
  const status = sop?.review_status ?? "PENDING";
  const confidence = sop?.confidence_score ?? 0;
  
  const formattedDate = new Date(document.created_at).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusLabel = (statusStr: string) => {
    switch (statusStr) {
      case "APPROVED":
      case "AUTO_PUBLISH":
        return "Verified & Published";
      case "HUMAN_REVIEW":
        return "Awaiting Review";
      default:
        return "Under Ingestion";
    }
  };

  const metadataItems = [
    { label: "Document Source", value: document.source_type.toUpperCase() },
    { label: "Verification Status", value: getStatusLabel(status) },
    { label: "Verification Score", value: confidence > 0 ? `${confidence}% Confidence` : "Not calculated" },
    { label: "Lifecycle Stage", value: status === "APPROVED" ? "Approved SOP" : "Staging Context" },
    { label: "Created Date", value: formattedDate },
    { label: "Owner Permissions", value: "System Administrator" },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 rounded-xl border border-border/25 bg-secondary/15 p-4 select-none">
      {metadataItems.map((item, i) => (
        <div key={i} className="space-y-1">
          <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
            {item.label}
          </span>
          <span className="block text-xs font-medium text-foreground/90">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
