import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RelatedKnowledgeItem } from "@/types/search";

type RelatedKnowledgeProps = {
  items: RelatedKnowledgeItem[];
  onSelect?: (title: string) => void;
};

export function RelatedKnowledge({ items, onSelect }: RelatedKnowledgeProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-label="Related knowledge">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Related knowledge</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {items.slice(0, 5).map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(item.title)}
                  className="flex w-full items-start gap-3 rounded-md border bg-background p-3 text-left transition-colors duration-200 hover:bg-accent"
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                    <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.source}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
