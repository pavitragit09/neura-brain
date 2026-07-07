"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConnectorStatusType = "connected" | "syncing" | "needs_attention" | "coming_soon" | "disconnected";

type ConnectorStatusProps = {
  status: ConnectorStatusType;
  className?: string;
};

export function ConnectorStatus({ status, className }: ConnectorStatusProps) {
  const getStatusDetails = (type: ConnectorStatusType) => {
    switch (type) {
      case "connected":
        return {
          label: "Connected",
          classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10",
        };
      case "disconnected":
        return {
          label: "Not Connected",
          classes: "bg-secondary/60 border-border/15 text-muted-foreground/80",
        };
      case "syncing":
        return {
          label: "Syncing",
          classes: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/10",
          icon: <Loader2 className="size-3 animate-spin shrink-0" />,
        };
      case "needs_attention":
        return {
          label: "Attention Required",
          classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10",
        };
      default:
        return {
          label: "Coming Soon",
          classes: "bg-secondary/40 border-border/15 text-muted-foreground/80",
        };
    }
  };

  const details = getStatusDetails(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[9px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full border select-none",
        details.classes,
        className
      )}
    >
      {details.icon}
      {details.label}
    </span>
  );
}
