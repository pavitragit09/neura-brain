"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrustSummary, getPendingReviews, getAuditLogs } from "@/lib/api/client";
import { TrustHealth } from "./trust-health";
import { ReviewQueue } from "./review-queue";
import { AuditActivity } from "./audit-activity";
import { ReviewDetailSheet } from "./review-detail-sheet";
import { TrustLoading } from "./trust-loading";
import { TrustEmpty } from "./trust-empty";
import { TrustError } from "./trust-error";
import type { SOPItem } from "@/types/knowledge";

export function TrustWorkspace() {
  const [selectedSop, setSelectedSop] = useState<SOPItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Queries
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
    data: pendingReviews = [],
    isLoading: isPendingLoading,
    isError: isPendingError,
    error: pendingError,
    refetch: refetchPending,
  } = useQuery({
    queryKey: ["pending-reviews"],
    queryFn: getPendingReviews,
  });

  const {
    data: auditLogs = [],
    isLoading: isLogsLoading,
    isError: isLogsError,
    error: logsError,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: getAuditLogs,
  });

  const isLoading = isSummaryLoading || isPendingLoading || isLogsLoading;
  const isError = isSummaryError || isPendingError || isLogsError;
  const activeError = summaryError || pendingError || logsError;

  const handleRetry = () => {
    refetchSummary();
    refetchPending();
    refetchLogs();
  };

  const handleInspect = (sop: SOPItem) => {
    setSelectedSop(sop);
    setIsSheetOpen(true);
  };

  const handleActionSuccess = () => {
    refetchSummary();
    refetchPending();
    refetchLogs();
  };

  if (isLoading) {
    return <TrustLoading />;
  }

  if (isError || !summary) {
    return <TrustError error={activeError} onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-6">
      {/* Title Header Block */}
      <div className="border-b border-border/20 pb-4 select-none">
        <h2 className="text-xl font-medium tracking-tight text-foreground/90">Trust Engine</h2>
        <p className="text-xs text-muted-foreground/75 font-normal max-w-[480px] mt-0.5 leading-relaxed">
          Cryptographically verify indexed context, audit ingestion pipeline transactions, and resolve pending verification checks.
        </p>
      </div>

      {/* Trust & Health Stats Summary Grid */}
      <TrustHealth summary={summary} />

      {/* Grid split: Review Queue vs Logs Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Review queue list */}
        <div className="lg:col-span-2">
          {pendingReviews.length > 0 ? (
            <ReviewQueue sops={pendingReviews} onInspect={handleInspect} />
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80 px-0.5 select-none">
                Review Queue
              </h3>
              <TrustEmpty />
            </div>
          )}
        </div>

        {/* Audit Log Activity */}
        <div className="rounded-xl border border-border/25 bg-card p-5 h-fit shadow-sm/5">
          <AuditActivity logs={auditLogs} isValid={summary.audit_chain_valid} />
        </div>
      </div>

      {/* Peeking Detail Sheet for human review validations */}
      <ReviewDetailSheet
        sop={selectedSop}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedSop(null);
        }}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
}
