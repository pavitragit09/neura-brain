import { FileText, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SearchSource } from "@/types/search";

type CitationsListProps = {
  sources: SearchSource[];
};

export function CitationsList({ sources }: CitationsListProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <section aria-label="Citations">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {sources.map((source) => {
              const isGDrive = source.source_type === "google_drive";
              return (
                <li key={`${source.document}-${source.chunk_index}`}>
                  <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                      {isGDrive ? (
                        <Link2 className="size-4 text-primary" aria-hidden="true" />
                      ) : (
                        <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 leading-normal">
                      <div className="flex flex-wrap items-center gap-2">
                        {isGDrive && source.google_web_view_link ? (
                          <a
                            href={source.google_web_view_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:underline flex items-center gap-1 leading-none select-text cursor-pointer"
                          >
                            {source.document}
                            <span className="text-[10px] select-none text-muted-foreground/60 font-sans">↗</span>
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-foreground/90 select-text leading-none">{source.document}</p>
                        )}
                        <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded font-semibold select-none leading-none border shrink-0 ${
                          isGDrive 
                            ? "bg-primary/5 text-primary border-primary/10" 
                            : "bg-muted text-muted-foreground border-border/10"
                        }`}>
                          {isGDrive ? "GOOGLE DRIVE" : "UPLOADED PDF"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground/80 mt-1 select-none">
                        Section {source.chunk_index + 1}
                      </p>
                      {source.excerpt && (
                        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed select-text font-normal">
                          {source.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
