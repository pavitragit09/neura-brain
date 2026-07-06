"use client";

import { FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/lib/api/client";
import { formatDateTime } from "@/lib/date";

export function RecentKnowledge() {
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });

  const recentItems = documents.slice(0, 4);

  return (
    <section aria-label="Recent knowledge" className="flex flex-col gap-3.5 select-none">
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80 px-1">
        Recent knowledge
      </h3>
      <div className="rounded-xl border border-border/30 bg-card p-5 shadow-sm/5 transition-all duration-200 hover:shadow-md/5 min-h-[160px] flex flex-col justify-center">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 bg-secondary/50 rounded-lg" />
            ))}
          </div>
        ) : recentItems.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {recentItems.map((item) => (
              <li key={item.id}>
                <div className="group flex items-start gap-3 rounded-lg p-2 -m-2 hover:bg-secondary/45 transition-colors duration-150 cursor-pointer">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary/70 border border-border/20 text-muted-foreground/80 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors duration-150">
                    <FileText className="size-3.5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1 leading-tight mt-0.5">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[13px] font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-150">
                        {item.filename}
                      </p>
                      {item.processing_status === "completed" && (
                        <span className="shrink-0 inline-flex size-3.5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/5" title="Verified knowledge asset">
                          <svg className="size-2 fill-current" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground/80 mt-1">
                      {item.source_type.toUpperCase()} <span className="text-muted-foreground/30 font-mono">/</span> {formatDateTime(item.created_at)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <FileText className="size-5 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-[11px] text-muted-foreground/75 leading-normal max-w-[200px] mx-auto">
              No recent knowledge assets. Import files to build your network.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
