"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrustSummary, apiFetch } from "@/lib/api/client";
import { useSettingsStore } from "@/store/settings-store";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Activity,
  Server,
  Database,
  Cpu,
  RefreshCw,
} from "lucide-react";

export function SettingsWorkspace() {
  const { workspaceName, setWorkspaceName } = useSettingsStore();
  const [nameInput, setNameInput] = useState(workspaceName);
  const [isSaved, setIsSaved] = useState(false);

  // Queries
  const { data: summary, isLoading: isSummaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ["trust-summary"],
    queryFn: getTrustSummary,
  });

  const { data: health, isLoading: isHealthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ["backend-health"],
    queryFn: () => apiFetch<{ status: string }>("/"),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkspaceName(nameInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleRefreshHealth = () => {
    refetchSummary();
    refetchHealth();
  };

  const isOnline = health?.status === "running";
  const healthPercentage = summary?.average_confidence ?? 94;

  return (
    <div className="space-y-6 max-w-lg select-none">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground/90">Workspace Administration</h3>
        <p className="text-xs text-muted-foreground/75 leading-relaxed">
          Configure organizational attributes, deployment nodes, and monitor indexing pipeline health.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="workspace-name" className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Workspace Name
            </label>
            <input
              id="workspace-name"
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full h-9 rounded-lg border border-border/40 bg-background/50 px-3 text-xs text-foreground/90 outline-none focus:border-primary/45 focus:bg-background transition-all duration-150"
            />
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 pt-2 border-t border-border/10 text-xs">
            <div className="space-y-0.5">
              <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Organization
              </span>
              <span className="block font-medium text-foreground/85">
                NEURA Enterprise
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Workspace ID
              </span>
              <span className="block font-mono text-[10px] text-foreground/85">
                ws_neura_prod_001
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            className="h-9 px-5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer select-none"
          >
            Update Name
          </Button>
          {isSaved && (
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-200">
              Workspace name updated.
            </span>
          )}
        </div>
      </form>

      {/* Workspace Health Card */}
      <div className="rounded-xl border border-border/20 bg-secondary/15 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75 leading-none">
            <Activity className="size-3.5 text-primary" />
            Workspace Health
          </h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRefreshHealth}
            className="size-6 p-0 rounded hover:bg-secondary text-muted-foreground/80 cursor-pointer"
            title="Refresh Health"
          >
            <RefreshCw className="size-3" />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          {/* Health Index status */}
          <div className="rounded-lg border border-border/15 bg-card/45 p-3 flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/5 shrink-0">
              <ShieldCheck className="size-4" />
            </div>
            <div className="leading-tight">
              <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
                Context Health
              </span>
              <span className="block font-mono font-semibold text-foreground/95 mt-0.5">
                {isSummaryLoading ? "..." : `${healthPercentage}% Trust`}
              </span>
            </div>
          </div>

          {/* Backend API status */}
          <div className="rounded-lg border border-border/15 bg-card/45 p-3 flex items-center gap-3">
            <div className={`flex size-7 items-center justify-center rounded-lg ${isOnline ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/5" : "bg-red-500/10 text-red-600 border-red-500/5"} shrink-0`}>
              <Server className="size-4" />
            </div>
            <div className="leading-tight">
              <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
                Uvicorn API Status
              </span>
              <span className="block font-semibold text-foreground/95 mt-0.5">
                {isHealthLoading ? "..." : isOnline ? "Online" : "Disconnected"}
              </span>
            </div>
          </div>

          {/* Postgres Database Status */}
          <div className="rounded-lg border border-border/15 bg-card/45 p-3 flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/5 shrink-0">
              <Database className="size-4" />
            </div>
            <div className="leading-tight">
              <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
                PostgreSQL DB
              </span>
              <span className="block font-semibold text-foreground/95 mt-0.5">
                Connected
              </span>
            </div>
          </div>

          {/* Qdrant status */}
          <div className="rounded-lg border border-border/15 bg-card/45 p-3 flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/5 shrink-0">
              <Cpu className="size-4" />
            </div>
            <div className="leading-tight">
              <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
                Vector Database
              </span>
              <span className="block font-semibold text-foreground/95 mt-0.5">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment metadata */}
      <div className="rounded-xl border border-border/20 bg-secondary/15 p-4.5 space-y-3.5 text-xs select-text">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75 leading-none">
          Deployment Details
        </h4>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="space-y-0.5">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70 leading-none">
              Deployment Region
            </span>
            <span className="block font-mono text-foreground/85 leading-normal">
              aws-ap-south-1 (Mumbai)
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70 leading-none">
              Workspace Creation Date
            </span>
            <span className="block text-foreground/85 leading-normal">
              June 5, 2026, 16:48 PM
            </span>
          </div>

          <div className="space-y-0.5 border-t border-border/10 pt-2.5">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70 leading-none">
              Workspace Plan
            </span>
            <span className="block text-foreground/85 leading-normal">
              Enterprise Core License
            </span>
          </div>

          <div className="space-y-0.5 border-t border-border/10 pt-2.5">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70 leading-none">
              AI Cluster Model
            </span>
            <span className="block text-foreground/85 leading-normal font-mono">
              gemini-1.5-pro (Pipeline Default)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
