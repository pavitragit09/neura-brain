"use client";

import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { ConnectorItem } from "@/types/knowledge";
import { ConnectorStatus } from "./connector-status";
import { Button } from "@/components/ui/button";
import {
  FileText,
  RefreshCw,
  Power,
  Info,
  Sparkles,
  Link2,
} from "lucide-react";

type ConnectorDetailSheetProps = {
  connector: ConnectorItem | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ConnectorDetailSheet({
  connector,
  isOpen,
  onClose,
}: ConnectorDetailSheetProps) {
  if (!connector) {
    return null;
  }

  const isComingSoon = connector.status === "coming_soon";

  // Value descriptions for Coming Soon connectors
  const getRoadmapDetails = (id: string) => {
    switch (id) {
      case "slack":
        return {
          expected: "Q3 2026",
          value: "Indexes public channels, message threads, and shared canvas docs to capture workspace conversations and ad-hoc troubleshooting context.",
          provides: "Real-time query resolutions based on team communications, expert search mappings, and previous incident discussions.",
        };
      case "notion":
        return {
          expected: "Q3 2026",
          value: "Synchronizes wiki pages, meeting notes, database lists, and workspace pages to provide a structured index of core company documentation.",
          provides: "Complete policy manuals, handbook references, onboarding checklist documents, and product roadmap outlines.",
        };
      case "github":
        return {
          expected: "Q4 2026",
          value: "Indexes pull requests, issue templates, markdown files, and commit discussions to understand technical decisions and architectural context.",
          provides: "Code documentation, API designs, repository workflows, and engineering guidelines.",
        };
      case "gmail":
        return {
          expected: "Q4 2026",
          value: "Accesses shared team inboxes and thread histories to capture client communication context and vendor updates.",
          provides: "Client onboarding agreements, vendor conversations, and shared mail log history.",
        };
      case "gdrive":
        return {
          expected: "Q3 2026",
          value: "Ingests slides, doc files, and spreadsheets across shared team drives to map cross-functional assets.",
          provides: "Product briefs, marketing reports, contract templates, and budget worksheets.",
        };
      default:
        return {
          expected: "H1 2027",
          value: "Indexes collaborative team workspaces, documents, and task lists to capture project management context.",
          provides: "Project specifications, team task boards, meeting transcripts, and support tickets.",
        };
    }
  };

  const roadmap = getRoadmapDetails(connector.id);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Notion-like side peek panel */}
      <SheetContent className="fixed inset-y-0 right-0 left-auto z-50 w-full sm:max-w-xl border-l border-border/20 bg-background shadow-2xl outline-none p-0 flex flex-col h-full animate-in slide-in-from-right duration-200">
        
        {/* Scrollable container */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="p-6 space-y-6">
            
            {/* Header block */}
            <div className="space-y-2 mt-4 select-none">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-secondary/80 border border-border/20 text-muted-foreground/80">
                    <Link2 className="size-4" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 font-mono">
                    Connector Config
                  </span>
                </div>
                <ConnectorStatus status={connector.status} />
              </div>
              <SheetTitle className="text-xl font-medium tracking-tight text-foreground/90 mt-1">
                {connector.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground/75 font-normal">
                {connector.description}
              </SheetDescription>
            </div>

            {/* Active Connected state */}
            {!isComingSoon ? (
              <>
                {/* Metadata list */}
                <div className="grid gap-4 grid-cols-2 rounded-xl border border-border/25 bg-secondary/15 p-4 select-none">
                  <div className="space-y-1">
                    <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                      Sync Status
                    </span>
                    <span className="block text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                      ACTIVE & SYNCED
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                      Workspace Domain
                    </span>
                    <span className="block text-xs font-medium text-foreground/90">
                      neura.local
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                      System Account
                    </span>
                    <span className="block text-xs font-medium text-foreground/90">
                      admin@neura.local
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                      Last Synchronized
                    </span>
                    <span className="block text-xs font-medium text-foreground/90">
                      {connector.lastSync || "Just now"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                      Knowledge Assets
                    </span>
                    <span className="block text-xs font-medium text-foreground/90 font-mono">
                      {connector.assetsCount || 0} files indexed
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                      Knowledge Chunks
                    </span>
                    <span className="block text-xs font-medium text-foreground/90 font-mono">
                      {connector.chunksCount || 0} nodes
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                      Embedding Pipeline
                    </span>
                    <span className="block text-xs font-medium text-foreground/90">
                      text-embedding-3-small (Qdrant)
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                      Sync Frequency
                    </span>
                    <span className="block text-xs font-medium text-foreground/90">
                      Continuous (Webhook listener)
                    </span>
                  </div>
                </div>

                {/* PDF Specific Info Section */}
                {connector.id === "pdf" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 px-0.5 select-none">
                      <FileText className="size-4 text-primary" />
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                        PDF Library Management
                      </h4>
                    </div>
                    <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 text-xs text-foreground/90 space-y-4">
                      <p className="text-muted-foreground/90 leading-relaxed">
                        The PDF Library holds direct document uploads processed by administrators. These assets are compiled and verified as high-confidence sources in the knowledge graph.
                      </p>
                      <div className="flex items-center justify-between text-[11px] border-t border-border/10 pt-3 text-muted-foreground/75 select-none">
                        <span>Total Storage Used</span>
                        <span className="font-mono font-medium text-foreground/95">1.2 MB</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Connected Channel Actions */}
                <div className="pt-4 border-t border-border/20 flex flex-wrap gap-2.5 select-none">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs gap-1.5 px-4 rounded-lg bg-background hover:bg-secondary cursor-pointer"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="size-3.5" />
                    Resync Connector
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="h-9 text-xs gap-1.5 px-4 rounded-lg border-red-500/10 text-red-500/60 bg-red-500/5 select-none cursor-not-allowed"
                  >
                    <Power className="size-3.5" />
                    Disconnect Channel
                  </Button>
                </div>
              </>
            ) : (
              /* Coming Soon / Roadmap state */
              <>
                {/* Roadmap Information Grid */}
                <div className="grid gap-4 grid-cols-2 rounded-xl border border-border/25 bg-secondary/15 p-4 select-none">
                  <div className="space-y-1 col-span-2">
                    <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                      Channel Availability
                    </span>
                    <span className="block text-xs font-semibold text-primary/95 font-mono">
                      PLANNED RELEASE · {roadmap.expected}
                    </span>
                  </div>
                </div>

                {/* Description details */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 px-0.5 select-none">
                    <Sparkles className="size-4 text-primary" />
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                      Knowledge Scope
                    </h4>
                  </div>
                  <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 text-xs text-foreground/90 space-y-4">
                    <div className="space-y-1">
                      <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                        What Knowledge it Contributes
                      </span>
                      <p className="text-muted-foreground/90 leading-relaxed mt-1">
                        {roadmap.provides}
                      </p>
                    </div>
                    <div className="space-y-1 pt-3 border-t border-border/10">
                      <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/80">
                        Why it is Valuable
                      </span>
                      <p className="text-muted-foreground/90 leading-relaxed mt-1">
                        {roadmap.value}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informational callout */}
                <div className="rounded-xl border border-border/20 bg-primary/5 p-4 flex gap-3 text-xs select-none">
                  <Info className="size-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-muted-foreground/85 leading-relaxed">
                    This connector is currently part of the NEURA synchronization roadmap. Development plans are underway to include it in the continuously verified organization knowledge graph.
                  </p>
                </div>
              </>
            )}

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
