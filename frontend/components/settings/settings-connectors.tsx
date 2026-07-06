"use client";

import { useSettingsStore } from "@/store/settings-store";
import { formatDateTime } from "@/lib/date";
import { Link, CheckCircle2 } from "lucide-react";

export function SettingsConnectors() {
  const {
    googleDriveSyncFreq,
    postgresSyncFreq,
    slackSyncFreq,
    setSyncFreqs,
  } = useSettingsStore();

  const syncOptions = [
    { label: "Real-time", value: "Real-time" },
    { label: "Every Hour", value: "Every Hour" },
    { label: "Every 6 Hours", value: "Every 6 Hours" },
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
  ];

  const connectors = [
    {
      id: "google-drive" as const,
      name: "Google Drive Ingress",
      status: "Connected",
      health: "Healthy",
      lastSync: "2026-07-05T07:36:18.144870",
      freq: googleDriveSyncFreq,
      setFreq: (val: string) => setSyncFreqs({ googleDriveSyncFreq: val }),
      description: "Indexes Google Workspace docs, sheets, and policy PDFs from shared company folders.",
    },
    {
      id: "postgres" as const,
      name: "PostgreSQL Database Ingress",
      status: "Connected",
      health: "Healthy",
      lastSync: "2026-06-29T09:41:24.822919",
      freq: postgresSyncFreq,
      setFreq: (val: string) => setSyncFreqs({ postgresSyncFreq: val }),
      description: "Syncs operational guidelines and rules tables directly from corporate database schemas.",
    },
    {
      id: "slack" as const,
      name: "Slack Knowledge Sync",
      status: "Connected",
      health: "Healthy",
      lastSync: "2026-07-06T12:51:00",
      freq: slackSyncFreq,
      setFreq: (val: string) => setSyncFreqs({ slackSyncFreq: val }),
      description: "Monitors pinned operational SOP posts inside workspace channels in real-time.",
    },
  ];

  return (
    <div className="space-y-6 max-w-lg select-none">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground/90">Connector Preferences</h3>
        <p className="text-xs text-muted-foreground/75 leading-relaxed">
          Configure synchronization frequencies, inspect health indicators, and monitor active ingress sources.
        </p>
      </div>

      <div className="space-y-4">
        {connectors.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 space-y-4.5"
          >
            {/* Title & Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-secondary/80 border border-border/20 text-muted-foreground/80">
                  <Link className="size-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-foreground/90">
                  {item.name}
                </h4>
              </div>
              <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/5 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wide uppercase text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-2.5" />
                {item.status}
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground/80 leading-normal max-w-[420px] select-text">
              {item.description}
            </p>

            <div className="grid gap-3.5 sm:grid-cols-2 pt-3 border-t border-border/10 text-xs">
              {/* Last Sync */}
              <div className="space-y-0.5">
                <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70 leading-none">
                  Last Sync Timestamp
                </span>
                <span className="block font-mono text-[10px] text-foreground/85 leading-normal mt-1">
                  {formatDateTime(item.lastSync)}
                </span>
              </div>

              {/* Sync Frequency selector */}
              <div className="space-y-1.5">
                <label
                  htmlFor={`freq-select-${item.id}`}
                  className="block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70 leading-none"
                >
                  Sync Frequency
                </label>
                <select
                  id={`freq-select-${item.id}`}
                  value={item.freq}
                  onChange={(e) => item.setFreq(e.target.value)}
                  className="w-full h-7 rounded-md border border-border/40 bg-background/50 px-2 text-[11px] text-foreground/90 outline-none focus:border-primary/45 focus:bg-background transition-all duration-150 cursor-pointer"
                >
                  {syncOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
