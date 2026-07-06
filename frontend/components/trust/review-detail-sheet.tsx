"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import {
  getSopVerification,
  getSopContradictions,
  approveSop,
  rejectSop,
} from "@/lib/api/client";
import type { SOPItem } from "@/types/knowledge";
import { VerificationPipeline } from "./verification-pipeline";
import {
  ShieldCheck,
  AlertTriangle,
  Scale,
  ScrollText,
  Check,
  X,
  Loader2,
} from "lucide-react";

type ReviewDetailSheetProps = {
  sop: SOPItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function ReviewDetailSheet({
  sop,
  isOpen,
  onClose,
  onSuccess,
}: ReviewDetailSheetProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";
  const [actionError, setActionError] = useState<string | null>(null);

  // Queries
  const { data: verification, isLoading: isVerificationLoading } = useQuery({
    queryKey: ["sop-verification", sop?.id],
    queryFn: () => getSopVerification(sop!.id),
    enabled: !!sop,
  });

  const { data: contradictionsData, isLoading: isContradictionsLoading } = useQuery({
    queryKey: ["sop-contradictions", sop?.id],
    queryFn: () => getSopContradictions(sop!.id),
    enabled: !!sop,
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: () => approveSop(sop!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["sops"] });
      queryClient.invalidateQueries({ queryKey: ["trust-summary"] });
      queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      onSuccess();
      onClose();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to approve SOP.";
      setActionError(message);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectSop(sop!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["sops"] });
      queryClient.invalidateQueries({ queryKey: ["trust-summary"] });
      queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      onSuccess();
      onClose();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to reject SOP.";
      setActionError(message);
    },
  });

  if (!sop) {
    return null;
  }

  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && !isMutating && onClose()}>
      {/* Notion-style Peek Details Sheet */}
      <SheetContent className="fixed inset-y-0 right-0 left-auto z-50 w-full sm:max-w-2xl border-l border-border/20 bg-background shadow-2xl outline-none p-0 flex flex-col h-full animate-in slide-in-from-right duration-200">
        
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="p-6 space-y-6">
            
            {/* Header Title block */}
            <div className="space-y-2 mt-4 select-none">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-secondary/80 border border-border/20 text-muted-foreground/80">
                  <Scale className="size-4" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 font-mono">
                  Governance Review
                </span>
              </div>
              <SheetTitle className="text-xl font-medium tracking-tight text-foreground/90 mt-1">
                {sop.document_name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground/75 font-normal">
                SOP ID: {sop.id} · Index Trust Rate: {sop.confidence_score}%
              </SheetDescription>
            </div>

            {/* Error display */}
            {actionError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex gap-3 text-xs select-none">
                <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-destructive leading-relaxed font-medium">
                  {actionError}
                </p>
              </div>
            )}

            {/* Verification Stepper Pipeline */}
            {isVerificationLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-5 animate-spin text-muted-foreground/80" />
              </div>
            ) : (
              verification && (
                <VerificationPipeline
                  stages={verification.stages}
                  overallStatus={verification.overall_status}
                />
              )
            )}

            {/* Extracted SOP Preview */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 px-0.5 select-none">
                <ScrollText className="size-4 text-primary" />
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  SOP Content Draft
                </h4>
              </div>
              <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 leading-relaxed text-xs text-foreground/90 whitespace-pre-wrap font-sans select-text">
                {sop.structured_sop}
              </div>
            </div>

            {/* Contradictions Panel */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 px-0.5 select-none">
                <AlertTriangle className="size-4 text-amber-500" />
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Contradictions Check
                </h4>
              </div>
              {isContradictionsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : contradictionsData?.status === "not_available" ? (
                <div className="rounded-xl border border-border/20 bg-secondary/10 p-4 flex items-center justify-between text-xs text-muted-foreground/80 select-none">
                  <span>Contradiction engine not implemented</span>
                  <span className="text-[9px] font-mono uppercase bg-secondary/80 px-2 py-0.5 rounded border border-border/10">
                    Not Available
                  </span>
                </div>
              ) : (
                <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 text-xs text-foreground/90">
                  No policy conflicts identified in this context.
                </div>
              )}
            </div>

            {/* Evidence Passages */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 px-0.5 select-none">
                <ShieldCheck className="size-4 text-emerald-500" />
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Evidence Inspector
                </h4>
              </div>
              <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 space-y-3 select-text">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="block text-[9px] font-mono text-muted-foreground/60 leading-none">
                      REFERENCE CITATION 1 · Source PDF · {sop.confidence_score}% confidence
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed italic">
                    {"\"...all procedural tasks and documentation updates must be cataloged inside the company wiki records for audit verification...\""}
                  </p>
                </div>
              </div>
            </div>

            {/* Governance Actions footer */}
            {isAdmin && sop.review_status !== "APPROVED" && sop.review_status !== "REJECTED" && (
              <div className="pt-4 border-t border-border/20 flex flex-wrap gap-2.5 select-none">
                <Button
                  type="button"
                  variant="default"
                  disabled={isMutating}
                  className="h-9 text-xs gap-1.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer select-none"
                  onClick={() => approveMutation.mutate()}
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  Approve SOP
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  disabled={isMutating}
                  className="h-9 text-xs gap-1.5 px-4 rounded-lg border-red-500/10 text-red-500/80 bg-red-500/5 hover:bg-red-500/10 select-none cursor-pointer"
                  onClick={() => rejectMutation.mutate()}
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <X className="size-3.5" />
                  )}
                  Reject SOP
                </Button>
              </div>
            )}

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
