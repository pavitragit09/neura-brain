"use client";

export function ConnectorLoading() {
  const items = Array.from({ length: 4 });

  return (
    <div className="space-y-8 select-none">
      {/* Skeleton block for a category */}
      {Array.from({ length: 2 }).map((_, catIdx) => (
        <div key={catIdx} className="space-y-4">
          <div className="h-5 w-32 bg-secondary/80 rounded animate-pulse" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-xl border border-border/30 bg-card p-5 shadow-sm/5 animate-pulse"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="size-8 rounded-lg bg-secondary/80 shrink-0" />
                  <div className="h-5 w-16 bg-secondary/85 rounded-full shrink-0" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-1/3 bg-secondary/80 rounded" />
                  <div className="h-3.5 w-full bg-secondary/60 rounded" />
                </div>
                <div className="mt-2 pt-3 border-t border-border/10 flex items-center justify-between">
                  <div className="h-3 w-1/4 bg-secondary/60 rounded" />
                  <div className="h-6 w-16 bg-secondary/80 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
