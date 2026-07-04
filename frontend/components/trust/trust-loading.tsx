"use client";

export function TrustLoading() {
  return (
    <div className="space-y-6 select-none animate-pulse">
      {/* Health Stats Skeletons */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/30 bg-card p-4.5 shadow-sm/5 h-20"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Review Queue Skeletons */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-5 w-32 bg-secondary/80 rounded" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl border border-border/30 bg-card p-4 shadow-sm/5"
              />
            ))}
          </div>
        </div>

        {/* Audit Log Skeletons */}
        <div className="space-y-4">
          <div className="h-5 w-40 bg-secondary/80 rounded" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-xl border border-border/30 bg-card p-3 shadow-sm/5"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
