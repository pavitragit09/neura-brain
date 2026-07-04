"use client";

import type { AuditLogItem } from "@/types/knowledge";
import { ShieldCheck, ShieldAlert, Database } from "lucide-react";

type AuditActivityProps = {
  logs: AuditLogItem[];
  isValid: boolean;
};

export function AuditActivity({ logs, isValid }: AuditActivityProps) {
  const displayLogs = [...logs].reverse().slice(0, 10); // Show latest 10 logs

  const formatLogDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between select-none">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80 px-0.5">
          Governance Activity
        </h3>
        {isValid ? (
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/5 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wide uppercase text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-3" />
            Chain verified
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/5 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wide uppercase text-red-600 dark:text-red-400">
            <ShieldAlert className="size-3" />
            Chain Mismatch
          </div>
        )}
      </div>

      {/* Logs timeline list */}
      <div className="relative border-l border-border/30 pl-4.5 ml-2 space-y-4 select-none">
        {displayLogs.map((log) => {
          return (
            <div key={log.id} className="relative">
              {/* timeline node */}
              <span className="absolute -left-[27px] top-0.5 flex size-4 items-center justify-center rounded-full bg-background border border-border/40 shadow-sm/5 text-muted-foreground/80">
                <Database className="size-2 text-muted-foreground/75" />
              </span>

              {/* log item description */}
              <div className="space-y-0.5">
                <div className="flex items-start justify-between gap-2 leading-none">
                  <span className="text-[11px] font-medium text-foreground/90 leading-tight">
                    {log.action.replace(/_/g, " ")}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground/65 shrink-0">
                    {formatLogDate(log.created_at)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground/80 leading-normal">
                  {log.details || `Performed by ${log.performed_by} on ${log.entity_type}`}
                </p>
                {log.current_hash && (
                  <span className="block text-[8px] font-mono text-muted-foreground/45 truncate max-w-[200px]" title={log.current_hash}>
                    hash: {log.current_hash}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {displayLogs.length === 0 && (
          <div className="text-center text-muted-foreground/80 text-xs py-4">
            No recent governance transactions.
          </div>
        )}
      </div>
    </div>
  );
}
