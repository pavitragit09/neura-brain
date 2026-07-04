"use client";

type NetworkHealthProps = {
  connectedCount: number;
  availableCount: number;
};

export function NetworkHealth({ connectedCount, availableCount }: NetworkHealthProps) {
  const stats = [
    { label: "Connected Channels", value: connectedCount.toString(), status: "active" },
    { label: "Expand Network", value: availableCount.toString(), status: "inactive" },
    { label: "Active Syncs", value: "0", status: "idle" },
    { label: "Needs Attention", value: "0", status: "good" },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 select-none">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/30 bg-card p-4.5 shadow-sm/5 flex flex-col justify-between gap-1.5"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 leading-none">
            {stat.label}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-xl font-medium tracking-tight text-foreground/90 font-mono leading-none">
              {stat.value}
            </span>
            {stat.label === "Connected Channels" && (
              <span className="relative flex h-2 w-2 mb-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
