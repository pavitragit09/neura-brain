"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ActivityFetchError = {
  status?: number;
  message?: string;
};

type ActivityErrorProps = {
  error?: Error | ActivityFetchError | null | unknown;
  onRetry: () => void;
};

export function ActivityError({ error, onRetry }: ActivityErrorProps) {
  const err = error as ActivityFetchError | null;

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-border/30 bg-card rounded-xl shadow-sm/5 select-none max-w-md mx-auto my-8">
      <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 border border-destructive/20 text-destructive mb-4">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </div>
      
      <h3 className="text-sm font-medium text-foreground tracking-tight">
        Failed to fetch activity logs
      </h3>
      
      <p className="text-xs text-muted-foreground/80 mt-1 max-w-[280px] leading-relaxed">
        {err?.message || "An error occurred while communicating with the NEURA auditing services."}
      </p>
      
      <Button
        type="button"
        variant="outline"
        onClick={onRetry}
        className="mt-5 h-9 text-xs px-4 rounded-lg bg-background hover:bg-secondary cursor-pointer"
      >
        Retry Connection
      </Button>
    </div>
  );
}
