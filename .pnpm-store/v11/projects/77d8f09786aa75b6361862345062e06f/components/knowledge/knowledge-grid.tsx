"use client";

import type { DocumentItem, SOPItem } from "@/types/knowledge";
import { KnowledgeCard } from "./knowledge-card";
import { KnowledgeLoading } from "./knowledge-loading";
import { KnowledgeEmptyState } from "./knowledge-empty-state";
import { KnowledgeErrorState } from "./knowledge-error-state";

type KnowledgeGridProps = {
  documents: DocumentItem[];
  sops: SOPItem[];
  viewMode: "grid" | "list";
  onCardClick: (document: DocumentItem) => void;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
};

export function KnowledgeGrid({
  documents,
  sops,
  viewMode,
  onCardClick,
  isLoading,
  isError,
  error,
  onRetry,
}: KnowledgeGridProps) {
  if (isLoading) {
    return <KnowledgeLoading viewMode={viewMode} />;
  }

  if (isError) {
    return <KnowledgeErrorState error={error} onRetry={onRetry} />;
  }

  if (documents.length === 0) {
    return <KnowledgeEmptyState />;
  }

  // Create lookup for SOPs by ID
  const sopMap = new Map(sops.map((s) => [s.id, s]));

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-3">
        {documents.map((doc) => {
          const matchingSop = sopMap.get(doc.sop_id);
          return (
            <KnowledgeCard
              key={doc.id}
              document={doc}
              sop={matchingSop}
              viewMode="list"
              onClick={() => onCardClick(doc)}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => {
        const matchingSop = sopMap.get(doc.sop_id);
        return (
          <KnowledgeCard
            key={doc.id}
            document={doc}
            sop={matchingSop}
            viewMode="grid"
            onClick={() => onCardClick(doc)}
          />
        );
      })}
    </div>
  );
}
