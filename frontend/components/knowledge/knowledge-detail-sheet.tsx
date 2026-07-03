"use client";

import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { KnowledgeMetadata } from "./knowledge-metadata";
import { KnowledgeVersionHistory } from "./knowledge-version-history";
import type { DocumentItem, SOPItem } from "@/types/knowledge";
import { FileText, FileDown, ShieldCheck, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";

type KnowledgeDetailSheetProps = {
  document: DocumentItem | null;
  sop: SOPItem | null;
  isOpen: boolean;
  onClose: () => void;
};

export function KnowledgeDetailSheet({
  document,
  sop,
  isOpen,
  onClose,
}: KnowledgeDetailSheetProps) {
  if (!document) {
    return null;
  }

  // Format date
  const uploadDate = new Date(document.created_at).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 
        Override default left w-72 with right-0 w-full sm:max-w-xl 
        to create the Notion-like side peek panel 
      */}
      <SheetContent className="fixed inset-y-0 right-0 left-auto z-50 w-full sm:max-w-2xl border-l border-border/20 bg-background shadow-2xl outline-none p-0 flex flex-col h-full animate-in slide-in-from-right duration-200">
        
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="p-6 space-y-6">
            
            {/* Header Title block */}
            <div className="space-y-2 mt-4 select-none">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-secondary/80 border border-border/20 text-muted-foreground/80">
                  <FileText className="size-4" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 font-mono">
                  Document Details
                </span>
              </div>
              <SheetTitle className="text-xl font-medium tracking-tight text-foreground/90 mt-1">
                {document.filename}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground/75 font-normal">
                Uploaded on {uploadDate} · Source type {document.source_type.toUpperCase()}
              </SheetDescription>
            </div>

            {/* Metadata Grid */}
            <KnowledgeMetadata document={document} sop={sop ?? undefined} />

            {/* Generated SOP Section */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 px-0.5 select-none">
                <ScrollText className="size-4 text-primary" />
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Generated SOP
                </h4>
              </div>
              <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 leading-relaxed text-xs text-foreground/90 whitespace-pre-wrap font-sans select-text">
                {sop ? (
                  sop.structured_sop
                ) : (
                  <span className="text-muted-foreground/80 italic">
                    No Standard Operating Procedure has been extracted yet. Process the document in the Ingestion service to generate.
                  </span>
                )}
              </div>
            </div>

            {/* Evidence & Excerpts Section */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 px-0.5 select-none">
                <ShieldCheck className="size-4 text-emerald-500" />
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Evidence Excerpts
                </h4>
              </div>
              <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 space-y-3 select-text">
                <div className="space-y-1">
                  <span className="block text-[9px] font-mono text-muted-foreground/60 leading-none">
                    EXCERPT 1 · Page 1 · Chunk 12
                  </span>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed italic">
                    {"\"...receipts must be provided for all claims over $25. Flight bookings should be made at least 14 days in advance where possible...\""}
                  </p>
                </div>
                <div className="space-y-1 pt-3 border-t border-border/10">
                  <span className="block text-[9px] font-mono text-muted-foreground/60 leading-none">
                    EXCERPT 2 · Page 3 · Chunk 41
                  </span>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed italic">
                    {"\"...annual leave accrues monthly, requires 2 weeks advance notice to the department administrator before validation...\""}
                  </p>
                </div>
              </div>
            </div>

            {/* Lifecycle Logs */}
            <KnowledgeVersionHistory document={document} sop={sop ?? undefined} />

            {/* Footer action bar inside scroll */}
            <div className="pt-4 border-t border-border/20 flex flex-wrap gap-2 select-none">
              <Button
                type="button"
                variant="outline"
                className="h-9 text-xs gap-1.5 px-4 rounded-lg bg-background hover:bg-secondary cursor-pointer select-none"
                onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/upload/`, "_blank")}
              >
                <FileDown className="size-4" />
                Open Original Document
              </Button>
            </div>
            
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
