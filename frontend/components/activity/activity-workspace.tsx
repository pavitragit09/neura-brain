"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuditLogs, getTrustSummary, getPendingReviews, getDocuments } from "@/lib/api/client";
import { ActivitySummary } from "./activity-summary";
import { ActivityFilters, FilterCategory } from "./activity-filters";
import { ActivityTimeline } from "./activity-timeline";
import { ActivityDetailSheet, ActivityEvent } from "./activity-detail-sheet";
import { ActivityLoading } from "./activity-loading";
import { ActivityEmpty } from "./activity-empty";
import { ActivityError } from "./activity-error";

export function ActivityWorkspace() {
  const [category, setCategory] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Queries
  const {
    data: logs = [],
    isLoading: isLogsLoading,
    isError: isLogsError,
    error: logsError,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: getAuditLogs,
  });

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ["trust-summary"],
    queryFn: getTrustSummary,
  });

  const {
    isLoading: isPendingLoading,
    refetch: refetchPending,
  } = useQuery({
    queryKey: ["pending-reviews"],
    queryFn: getPendingReviews,
  });

  const {
    data: docs = [],
    isLoading: isDocsLoading,
    refetch: refetchDocs,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });

  const isLoading = isLogsLoading || isSummaryLoading || isPendingLoading || isDocsLoading;
  const isError = isLogsError || isSummaryError;
  const activeError = logsError || summaryError;

  const handleRetry = () => {
    refetchLogs();
    refetchSummary();
    refetchPending();
    refetchDocs();
  };

  const handleSelectEvent = (event: ActivityEvent) => {
    setSelectedEvent(event);
    setIsSheetOpen(true);
  };

  if (isLoading) {
    return <ActivityLoading />;
  }

  if (isError || !summary) {
    return <ActivityError error={activeError} onRetry={handleRetry} />;
  }

  // 1. Dynamic chronological event mapper mapping DB audit logs & SOP tables
  const mappedEvents: ActivityEvent[] = [];

  // Map backend logs
  logs.forEach((log) => {
    const isSystem = log.performed_by === "system";

    if (log.action === "UPLOAD") {
      mappedEvents.push({
        id: `log-${log.id}`,
        type: isSystem ? "sop_generated" : "imported",
        title: isSystem ? "SOP Draft Generated" : "Knowledge Asset Imported",
        timestamp: log.created_at,
        description: log.details || `Uploaded file into context graph`,
        status: isSystem ? "completed" : "verified",
        actor: log.performed_by,
        documentName: log.details?.replace("Uploaded ", "") || "Context PDF",
        department: log.details?.toLowerCase().includes("curriculum") ? "Academic Operations" : "HR & Administration",
        auditHash: log.current_hash || undefined,
      });
    } else if (log.action === "DELETE") {
      mappedEvents.push({
        id: `log-${log.id}`,
        type: "sop_rejected",
        title: "Knowledge Asset Deleted",
        timestamp: log.created_at,
        description: log.details || `Purged file from vector store`,
        status: "purged",
        actor: log.performed_by,
        documentName: log.details?.replace("Deleted ", "") || "Context PDF",
        auditHash: log.current_hash || undefined,
      });
    } else if (log.action === "APPROVE_SOP") {
      mappedEvents.push({
        id: `log-${log.id}`,
        type: "sop_approved",
        title: "SOP Approved",
        timestamp: log.created_at,
        description: log.details || `Approved and published SOP`,
        status: "approved",
        actor: log.performed_by,
        documentName: log.details?.replace("Approved SOP for ", "") || "SOP File",
        auditHash: log.current_hash || undefined,
      });
    } else if (log.action === "REJECT_SOP") {
      mappedEvents.push({
        id: `log-${log.id}`,
        type: "sop_rejected",
        title: "SOP Rejected",
        timestamp: log.created_at,
        description: log.details || `Rejected SOP`,
        status: "rejected",
        actor: log.performed_by,
        documentName: log.details?.replace("Rejected SOP for ", "") || "SOP File",
        auditHash: log.current_hash || undefined,
      });
    }
  });

  // Supplement mapped feed with live database updates from SOP tables to make verification & reviews transparent
  docs.forEach((doc) => {
    // Check if doc has verification states
    if (doc.processing_status === "completed") {
      mappedEvents.push({
        id: `doc-${doc.id}-verified`,
        type: "verification_completed",
        title: "Knowledge Verification Completed",
        timestamp: doc.created_at,
        description: `Ingestion pipeline validated for ${doc.filename}`,
        status: "verified",
        actor: "NEURA Pipeline Manager",
        documentName: doc.filename,
        connectorName: doc.source_type,
      });
    }
  });

  // Combine and sort events
  const allEvents = [...mappedEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Group stats calculations
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const todayEventsCount = allEvents.filter((e) => new Date(e.timestamp).getTime() >= todayStart).length;

  // Local filters
  const filteredEvents = allEvents.filter((event) => {
    // 1. Category check
    if (category !== "all") {
      switch (category) {
        case "reviews":
          if (!["review_requested", "review_completed", "sop_rejected", "contradiction_detected"].includes(event.type))
            return false;
          break;
        case "uploads":
          if (!["imported", "sop_generated"].includes(event.type)) return false;
          break;
        case "verification":
          if (!["verification_completed", "audit_verified"].includes(event.type)) return false;
          break;
        case "connectors":
          if (event.type !== "connector_sync") return false;
          break;
        case "approvals":
          if (event.type !== "sop_approved") return false;
          break;
        case "contradictions":
          if (event.type !== "contradiction_detected") return false;
          break;
      }
    }

    // 2. Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.actor.toLowerCase().includes(q) ||
        (event.documentName && event.documentName.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title Header Block */}
      <div className="border-b border-border/20 pb-4 select-none">
        <h2 className="text-xl font-medium tracking-tight text-foreground/90">Activity</h2>
        <p className="text-xs text-muted-foreground/75 font-normal max-w-[480px] mt-0.5 leading-relaxed">
          Track uploads, reviews, approvals, connector synchronizations and verification events across your organization.
        </p>
      </div>

      {/* Activity Summary Metric Cards */}
      <ActivitySummary
        todayEventsCount={todayEventsCount}
        totalUpdatesCount={summary.knowledge_assets}
        pendingReviewsCount={summary.pending_review_count}
        auditChainValid={summary.audit_chain_valid}
      />

      {/* Category filters and local search */}
      <ActivityFilters
        category={category}
        onCategoryChange={setCategory}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {/* Timeline flow */}
      {filteredEvents.length > 0 ? (
        <ActivityTimeline events={filteredEvents} onSelectEvent={handleSelectEvent} />
      ) : (
        <ActivityEmpty />
      )}

      {/* Detail overlay Sheet */}
      <ActivityDetailSheet
        event={selectedEvent}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
}
