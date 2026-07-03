"use client";

import { useState, useTransition, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDocuments, apiFetch } from "@/lib/api/client";
import type { DocumentItem, SOPItem } from "@/types/knowledge";
import { mockDocuments, mockSOPs } from "@/lib/mock/knowledge-data";
import { KnowledgeToolbar } from "./knowledge-toolbar";
import { KnowledgeFilterBar, FilterValue } from "./knowledge-filter-bar";
import { KnowledgeGrid } from "./knowledge-grid";
import { KnowledgeDetailSheet } from "./knowledge-detail-sheet";

const isDev = process.env.NODE_ENV === "development";

export function KnowledgeWorkspace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  
  // Slide-over detail panel state
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [selectedSop, setSelectedSop] = useState<SOPItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Transition for smooth local filtering updates
  const [, startTransition] = useTransition();

  // Queries
  const {
    data: documents = [],
    isLoading: isDocLoading,
    isError: isDocError,
    error: docError,
    refetch: refetchDocs,
  } = useQuery<DocumentItem[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      try {
        return await getDocuments();
      } catch (err) {
        if (isDev) {
          console.warn("Backend /documents API failed in dev. Loading mock documents.", err);
          return mockDocuments;
        }
        throw err;
      }
    },
  });

  const {
    data: sops = [],
    isLoading: isSopsLoading,
    isError: isSopsError,
    error: sopsError,
    refetch: refetchSops,
  } = useQuery<SOPItem[]>({
    queryKey: ["sops"],
    queryFn: async () => {
      try {
        return await apiFetch<SOPItem[]>("/sops/");
      } catch (err) {
        if (isDev) {
          console.warn("Backend /sops API failed in dev. Loading mock SOPs.", err);
          return Object.values(mockSOPs);
        }
        throw err;
      }
    },
  });

  const isLoading = isDocLoading || isSopsLoading;
  const isError = isDocError || isSopsError;
  const activeError = docError || sopsError;

  const handleRetry = () => {
    refetchDocs();
    refetchSops();
  };

  // Map sops by ID for quick lookups
  const sopMap = useMemo(() => new Map(sops.map((s) => [s.id, s])), [sops]);

  // Process sorting & filtering
  const processedDocuments = useMemo(() => {
    let result = [...documents];

    // 1. Filter by search query
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      result = result.filter((doc) => doc.filename.toLowerCase().includes(term));
    }

    // 2. Filter by document characteristic chips
    if (activeFilter !== "all") {
      result = result.filter((doc) => {
        const matchingSop = sopMap.get(doc.sop_id);
        const reviewStatus = matchingSop?.review_status ?? "PENDING";
        
        switch (activeFilter) {
          case "pdf":
            return doc.source_type.toLowerCase() === "pdf";
          case "sop":
            return doc.sop_id !== null && doc.sop_id !== undefined && doc.sop_id > 0;
          case "verified":
            return reviewStatus === "APPROVED" || reviewStatus === "AUTO_PUBLISH";
          case "reviewing":
            return reviewStatus === "HUMAN_REVIEW" || reviewStatus === "PENDING";
          case "failed":
            return doc.processing_status === "failed";
          default:
            return true;
        }
      });
    }

    // 3. Sort
    result.sort((a, b) => {
      if (sortBy === "confidence") {
        const aConf = sopMap.get(a.sop_id)?.confidence_score ?? 0;
        const bConf = sopMap.get(b.sop_id)?.confidence_score ?? 0;
        return bConf - aConf;
      }
      
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      
      if (sortBy === "oldest") {
        return aTime - bTime;
      }
      
      // Default: newest
      return bTime - aTime;
    });

    return result;
  }, [documents, searchQuery, activeFilter, sortBy, sopMap]);

  // Select card & open Sheet
  const handleCardSelect = (doc: DocumentItem) => {
    const matchingSop = sopMap.get(doc.sop_id) ?? null;
    setSelectedDocument(doc);
    setSelectedSop(matchingSop);
    setIsSheetOpen(true);
  };

  const handleFilterChange = (filter: FilterValue) => {
    startTransition(() => {
      setActiveFilter(filter);
    });
  };

  const handleSearchChange = (val: string) => {
    startTransition(() => {
      setSearchQuery(val);
    });
  };

  return (
    <div className="space-y-6">
      {/* Search & Sort Actions Toolbar */}
      <KnowledgeToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Filter Chips Bar */}
      <KnowledgeFilterBar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Cards list / grid display */}
      <KnowledgeGrid
        documents={processedDocuments}
        sops={sops}
        viewMode={viewMode}
        onCardClick={handleCardSelect}
        isLoading={isLoading}
        isError={isError}
        error={activeError}
        onRetry={handleRetry}
      />

      {/* Slide-over side peek panel */}
      <KnowledgeDetailSheet
        document={selectedDocument}
        sop={selectedSop}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedDocument(null);
          setSelectedSop(null);
        }}
      />
    </div>
  );
}
