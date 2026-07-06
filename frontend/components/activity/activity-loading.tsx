"use client";

export function ActivityLoading() {
  return (
    <div className="space-y-6 select-none animate-pulse">
      {/* Summary Cards Skeleton */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/30 bg-card p-4 h-20"
          />
        ))}
      </div>

      {/* Filter and Search Bar Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between h-9 bg-secondary/20 rounded-lg w-full" />

      {/* Timeline Skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-20 bg-secondary/80 rounded" />
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, j) => (
                <div
                  key={j}
                  className="h-16 rounded-xl border border-border/30 bg-card p-4 shadow-sm/5"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
