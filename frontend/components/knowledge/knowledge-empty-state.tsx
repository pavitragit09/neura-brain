"use client";

import { FileX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

type KnowledgeEmptyStateProps = {
  title?: string;
  description?: string;
};

export function KnowledgeEmptyState({
  title = "No documents found",
  description = "No knowledge assets match your current search queries or filter selections.",
}: KnowledgeEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={FileX}
    />
  );
}
