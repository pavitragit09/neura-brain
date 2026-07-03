import { FileText } from "lucide-react";
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
            {sources.map((source) => (
              <li key={`${source.document}-${source.chunk_index}`}>
                <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                    <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{source.document}</p>
                    <p className="text-xs text-muted-foreground">Section {source.chunk_index + 1}</p>
                    {source.excerpt ? (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{source.excerpt}</p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
