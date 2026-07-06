"use client";

import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { formatDateTime } from "@/lib/date";
import { ActivityStatus } from "./activity-status";
import {
  ShieldCheck,
  Calendar,
  User,
  FileText,
  Building,
  Key,
  Layers,
  Link,
  Cpu,
} from "lucide-react";

export interface ActivityEvent {
  id: string;
  type:
    | "imported"
    | "updated"
    | "connector_sync"
    | "sop_generated"
    | "sop_approved"
    | "sop_rejected"
    | "verification_completed"
    | "contradiction_detected"
    | "review_requested"
    | "review_completed"
    | "audit_verified";
  title: string;
  timestamp: string;
  description: string;
  status: string;
  confidence?: number;
  actor: string;
  documentName?: string;
  department?: string;
  evidence?: string;
  auditHash?: string;
  sopId?: number;
  connectorName?: string;
}

type ActivityDetailSheetProps = {
  event: ActivityEvent | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ActivityDetailSheet({ event, isOpen, onClose }: ActivityDetailSheetProps) {
  if (!event) {
    return null;
  }

  const formattedDate = formatDateTime(event.timestamp);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Notion-style detail peek sheet */}
      <SheetContent className="fixed inset-y-0 right-0 left-auto z-50 w-full sm:max-w-xl border-l border-border/20 bg-background shadow-2xl outline-none p-0 flex flex-col h-full animate-in slide-in-from-right duration-200">
        
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="p-6 space-y-6">
            
            {/* Header Block */}
            <div className="space-y-2 mt-4 select-none">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-secondary/80 border border-border/20 text-muted-foreground/80">
                    <Layers className="size-4" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 font-mono">
                    Activity details
                  </span>
                </div>
                <ActivityStatus status={event.status} />
              </div>
              <SheetTitle className="text-xl font-medium tracking-tight text-foreground/90 mt-1">
                {event.title}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground/75 font-normal">
                Event ID: {event.id}
              </SheetDescription>
            </div>

            {/* Event Details Grid */}
            <div className="grid gap-4 grid-cols-2 rounded-xl border border-border/25 bg-secondary/15 p-4 select-none text-xs">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                  <Calendar className="size-3" />
                  Timestamp
                </span>
                <span className="block font-medium text-foreground/90">
                  {formattedDate}
                </span>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                  <User className="size-3" />
                  Actor
                </span>
                <span className="block font-medium text-foreground/90">
                  {event.actor}
                </span>
              </div>

              {event.documentName && (
                <div className="space-y-1 col-span-2 border-t border-border/10 pt-2.5">
                  <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                    <FileText className="size-3" />
                    Related Document
                  </span>
                  <span className="block font-medium text-foreground/90 truncate">
                    {event.documentName}
                  </span>
                </div>
              )}

              {event.department && (
                <div className="space-y-1 border-t border-border/10 pt-2.5">
                  <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                    <Building className="size-3" />
                    Department
                  </span>
                  <span className="block font-medium text-foreground/90">
                    {event.department}
                  </span>
                </div>
              )}

              {event.confidence !== undefined && (
                <div className="space-y-1 border-t border-border/10 pt-2.5">
                  <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                    <ShieldCheck className="size-3" />
                    Confidence Score
                  </span>
                  <span className="block font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                    {event.confidence}%
                  </span>
                </div>
              )}

              {event.connectorName && (
                <div className="space-y-1 border-t border-border/10 pt-2.5">
                  <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                    <Link className="size-3" />
                    Connector
                  </span>
                  <span className="block font-medium text-foreground/90">
                    {event.connectorName}
                  </span>
                </div>
              )}

              {event.sopId !== undefined && (
                <div className="space-y-1 border-t border-border/10 pt-2.5">
                  <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                    <Cpu className="size-3" />
                    Related SOP ID
                  </span>
                  <span className="block font-medium text-foreground/90 font-mono">
                    SOP-{event.sopId}
                  </span>
                </div>
              )}

              {event.auditHash && (
                <div className="space-y-1 col-span-2 border-t border-border/10 pt-2.5">
                  <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                    <Key className="size-3" />
                    Audit Log Cryptographic Hash
                  </span>
                  <span className="block font-mono text-[10px] text-muted-foreground/95 truncate select-all" title={event.auditHash}>
                    {event.auditHash}
                  </span>
                </div>
              )}
            </div>

            {/* Evidence Block */}
            {event.evidence && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 px-0.5 select-none">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    Evidence Passage
                  </h4>
                </div>
                <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 leading-relaxed text-xs text-muted-foreground/80 italic select-text">
                  {`"${event.evidence}"`}
                </div>
              </div>
            )}

            {/* Ingestion Pipeline Status note */}
            <div className="rounded-xl border border-border/20 bg-primary/5 p-4 flex gap-3 text-xs select-none">
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="text-muted-foreground/85 leading-relaxed">
                This transaction has been cryptographically signed and immutably appended to NEURA&apos;s decentralized verification ledger.
              </p>
            </div>

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
