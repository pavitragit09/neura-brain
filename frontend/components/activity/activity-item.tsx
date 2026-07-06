"use client";

import type { ActivityEvent } from "./activity-detail-sheet";
import { formatDateTime } from "@/lib/date";
import { ActivityStatus } from "./activity-status";
import {
  FileUp,
  RefreshCw,
  Link,
  Cpu,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  Database,
} from "lucide-react";

type ActivityItemProps = {
  event: ActivityEvent;
  onClick: () => void;
};

export function ActivityItem({ event, onClick }: ActivityItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "imported":
        return <FileUp className="size-4 text-blue-500" />;
      case "updated":
        return <RefreshCw className="size-4 text-indigo-500" />;
      case "connector_sync":
        return <Link className="size-4 text-violet-500" />;
      case "sop_generated":
        return <Cpu className="size-4 text-primary" />;
      case "sop_approved":
        return <CheckCircle2 className="size-4 text-emerald-500" />;
      case "sop_rejected":
        return <XCircle className="size-4 text-destructive" />;
      case "verification_completed":
      case "audit_verified":
        return <ShieldCheck className="size-4 text-emerald-500" />;
      case "contradiction_detected":
        return <AlertTriangle className="size-4 text-amber-500" />;
      case "review_requested":
        return <HelpCircle className="size-4 text-amber-600" />;
      case "review_completed":
        return <BookOpen className="size-4 text-foreground/70" />;
      default:
        return <Database className="size-4 text-muted-foreground/80" />;
    }
  };

  const formattedTime = formatDateTime(event.timestamp);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Event ${event.title} at ${formattedTime}. Status: ${event.status}. Description: ${event.description}`}
      className="group flex items-start gap-4 p-4.5 rounded-xl border border-border/15 bg-card/25 hover:border-border/30 hover:bg-card/90 hover:shadow-sm/5 transition-all duration-150 ease-out cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
    >
      {/* Time Label (Small screen hides, large screen details) */}
      <span className="hidden sm:inline-block w-28 text-[10px] font-mono text-muted-foreground/60 shrink-0 text-right pt-0.5">
        {formattedTime}
      </span>

      {/* Brand Icon wrapper */}
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary/80 border border-border/20 text-muted-foreground/80 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors duration-150">
        {getIcon(event.type)}
      </div>

      {/* Info Content Block */}
      <div className="min-w-0 flex-1 space-y-1 leading-tight">
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className="text-[13px] font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-150">
            {event.title}
          </h4>
          <span className="sm:hidden text-[9px] font-mono text-muted-foreground/50">
            {formattedTime}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground/80 leading-normal">
          {event.description}
        </p>
      </div>

      {/* Badges block */}
      <div className="flex flex-wrap items-center gap-2 shrink-0 select-none self-end sm:self-center">
        {event.confidence !== undefined && (
          <span className="text-[9px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/5">
            {event.confidence}% confidence
          </span>
        )}
        <ActivityStatus status={event.status} />
      </div>
    </div>
  );
}
