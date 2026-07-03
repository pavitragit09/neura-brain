"use client";

type KnowledgeLoadingProps = {
  viewMode?: "grid" | "list";
};

export function KnowledgeLoading({ viewMode = "grid" }: KnowledgeLoadingProps) {
  const items = Array.from({ length: 6 });

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-3">
        {items.map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-border/30 bg-card p-4 shadow-sm/5 animate-pulse"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="size-8 rounded-lg bg-secondary/80 shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="h-4 w-1/3 bg-secondary rounded" />
                <div className="h-3 w-1/4 bg-secondary rounded" />
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="h-5 w-16 bg-secondary rounded-full" />
              <div className="h-5 w-20 bg-secondary rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-xl border border-border/30 bg-card p-5 shadow-sm/5 animate-pulse"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="size-8 rounded-lg bg-secondary/80 shrink-0" />
            <div className="h-5 w-16 bg-secondary rounded-full shrink-0" />
          </div>
          <div className="space-y-2.5">
            <div className="h-4 w-3/4 bg-secondary rounded" />
            <div className="h-3 w-1/2 bg-secondary rounded" />
          </div>
          <div className="mt-2 pt-3 border-t border-border/10 flex items-center justify-between">
            <div className="h-3 w-1/4 bg-secondary rounded" />
            <div className="h-3 w-1/5 bg-secondary rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
