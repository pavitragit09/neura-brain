"use client";

export function SettingsLoading() {
  return (
    <div className="space-y-6 max-w-lg select-none animate-pulse">
      <div className="space-y-2">
        <div className="h-5 bg-secondary/50 rounded-lg w-1/3" />
        <div className="h-3.5 bg-secondary/30 rounded-lg w-2/3" />
      </div>

      <div className="rounded-xl border border-border/20 bg-card p-5 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-secondary/40 rounded w-1/4" />
            <div className="h-8 bg-secondary/20 rounded-lg w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
