"use client";

import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { ConnectorItem } from "@/types/knowledge";
import { ConnectorStatus } from "./connector-status";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadDocument } from "@/lib/api/client";
import {
  FileText,
  RefreshCw,
  Power,
  Info,
  Sparkles,
  Link2,
  UploadCloud,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileUp,
} from "lucide-react";

export type UploadingFile = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "idle" | "uploading" | "processing" | "completed" | "failed";
  error?: string;
  abortController?: AbortController;
  file: File;
};

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
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [recentUploads, setRecentUploads] = useState<{ name: string; size: number; date: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const filesArray = Array.from(e.dataTransfer.files);
      filesArray.forEach((file) => handleUploadFile(file));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const filesArray = Array.from(e.target.files);
      filesArray.forEach((file) => handleUploadFile(file));
    }
  };

  const triggerUpload = (file: File, fileId: string, abortController: AbortController) => {
    uploadDocument(
      file,
      (progress) => {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  progress,
                  status: progress === 100 ? "processing" : "uploading",
                }
              : f
          )
        );
      },
      abortController.signal
    )
      .then(() => {
        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: "completed", progress: 100 } : f))
        );
        setRecentUploads((prev) => [
          { name: file.name, size: file.size, date: new Date().toISOString() },
          ...prev,
        ]);

        // Invalidate react query caches
        queryClient.invalidateQueries({ queryKey: ["documents"] });
        queryClient.invalidateQueries({ queryKey: ["sops"] });
        queryClient.invalidateQueries({ queryKey: ["trust-summary"] });
        queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
        queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, status: "failed", error: "Upload cancelled" } : f))
          );
        } else {
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, status: "failed", error: err.message || "Upload failed" } : f))
          );
        }
      });
  };

  const handleUploadFile = (file: File) => {
    const fileId = Math.random().toString();
    const abortController = new AbortController();

    const newUpload: UploadingFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading",
      abortController,
      file,
    };

    setUploadingFiles((prev) => [newUpload, ...prev]);

    // Validation
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const allowed = [".pdf", ".docx", ".txt", ".md"];

    if (!allowed.includes(ext)) {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "failed",
                error: "Unsupported file type",
              }
            : f
        )
      );
      return;
    }

    if (ext !== ".pdf") {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "failed",
                error: "Coming Soon: Ingestion pipeline under development",
              }
            : f
        )
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "failed", error: "File size exceeds 10MB limit" }
            : f
        )
      );
      return;
    }

    triggerUpload(file, fileId, abortController);
  };

  const handleCancelUpload = (fileId: string) => {
    const target = uploadingFiles.find((f) => f.id === fileId);
    if (target?.abortController) {
      target.abortController.abort();
    }
  };

  const handleRetryUpload = (fileId: string) => {
    const target = uploadingFiles.find((f) => f.id === fileId);
    if (!target) return;

    const abortController = new AbortController();
    setUploadingFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              status: "uploading",
              progress: 0,
              error: undefined,
              abortController,
            }
          : f
      )
    );

    triggerUpload(target.file, fileId, abortController);
  };

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
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 px-0.5 select-none">
                      <FileText className="size-4 text-primary" />
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                        PDF Library Management
                      </h4>
                    </div>

                    {/* Drag and Drop zone */}
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-all duration-150 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                        dragActive
                          ? "border-primary bg-primary/5 scale-[0.99] border-solid"
                          : "border-border/30 bg-card hover:border-border/60 hover:bg-secondary/15"
                      }`}
                    >
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        className="hidden"
                        accept=".pdf,.docx,.txt,.md"
                      />
                      <UploadCloud className="size-8 text-muted-foreground/60 mb-2.5" />
                      <p className="text-xs font-medium text-foreground/90">
                        Drag and drop files here, or <span className="text-primary hover:underline">browse</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1 select-text">
                        Supports PDF. TXT, DOCX, MD (Coming Soon). Max 10MB per file.
                      </p>
                    </div>

                    {/* Uploading Files list */}
                    {uploadingFiles.length > 0 && (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75 px-0.5 leading-none mb-1 select-none">
                          Ingestion Jobs ({uploadingFiles.length})
                        </span>
                        <div className="flex flex-col gap-2">
                          {uploadingFiles.map((f) => {
                            const isFailed = f.status === "failed";
                            const isCompleted = f.status === "completed";
                            const isProcessing = f.status === "processing";

                            return (
                              <div
                                key={f.id}
                                className="rounded-lg border border-border/15 bg-secondary/10 p-3 flex flex-col gap-2"
                              >
                                <div className="flex items-start justify-between gap-3 text-xs leading-tight">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <FileUp className="size-3.5 text-muted-foreground/80 shrink-0" />
                                    <span className="truncate font-medium text-foreground/90" title={f.name}>
                                      {f.name}
                                    </span>
                                    <span className="text-[9px] font-mono text-muted-foreground/60 shrink-0">
                                      ({(f.size / (1024 * 1024)).toFixed(2)} MB)
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {isFailed ? (
                                      <button
                                        type="button"
                                        onClick={() => handleRetryUpload(f.id)}
                                        className="text-[9px] font-mono font-bold text-primary hover:underline cursor-pointer"
                                      >
                                        Retry
                                      </button>
                                    ) : !isCompleted && !isProcessing ? (
                                      <button
                                        type="button"
                                        onClick={() => handleCancelUpload(f.id)}
                                        className="text-[9px] font-mono font-bold text-muted-foreground/80 hover:text-foreground cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    ) : null}
                                  </div>
                                </div>

                                {/* Progress or status message */}
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                    <div
                                      style={{ width: `${f.progress}%` }}
                                      className={`h-full transition-all duration-150 ${
                                        isFailed
                                          ? "bg-red-500"
                                          : isCompleted
                                          ? "bg-emerald-500"
                                          : isProcessing
                                          ? "bg-primary animate-pulse"
                                          : "bg-primary"
                                      }`}
                                    />
                                  </div>
                                  <span className="text-[9px] font-mono font-semibold text-muted-foreground/80 leading-none shrink-0 w-8 text-right">
                                    {isFailed ? (
                                      <span className="text-red-500">Error</span>
                                    ) : isCompleted ? (
                                      <span className="text-emerald-500">100%</span>
                                    ) : isProcessing ? (
                                      <span className="text-primary animate-pulse">Sync</span>
                                    ) : (
                                      `${f.progress}%`
                                    )}
                                  </span>
                                </div>

                                {/* Error detailed description */}
                                {f.error && (
                                  <div className="flex items-start gap-1 text-[10px] text-red-500 leading-normal bg-red-500/5 px-2 py-1 rounded border border-red-500/10">
                                    <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                                    <span>{f.error}</span>
                                  </div>
                                )}

                                {/* Processing message */}
                                {isProcessing && (
                                  <div className="flex items-center gap-1.5 text-[10px] text-primary/90 leading-none">
                                    <Loader2 className="size-3.5 animate-spin" />
                                    <span>Compiling into NEURA knowledge graph...</span>
                                  </div>
                                )}

                                {/* Complete message */}
                                {isCompleted && (
                                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 leading-none">
                                    <CheckCircle className="size-3.5" />
                                    <span>Ingested and compiled into NEURA knowledge graph</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Recent Uploads section */}
                    {recentUploads.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-border/10 select-none">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75 px-0.5 leading-none mb-1">
                          Session Ingests
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {recentUploads.map((up, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between gap-3 text-xs py-1.5 px-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
                            >
                              <div className="truncate font-medium text-foreground/80 pr-2">
                                {up.name}
                              </div>
                              <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/5 px-1.5 py-0.5 rounded text-[8px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                                GRAPH INDEXED
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
