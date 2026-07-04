"use client";

import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

type TrustFetchError = {
  status?: number;
  message?: string;
};

type TrustErrorProps = {
  error?: Error | TrustFetchError | null | unknown;
  onRetry: () => void;
};

export function TrustError({ error, onRetry }: TrustErrorProps) {
  const err = error as TrustFetchError | null;

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-border/30 bg-card rounded-xl shadow-sm/5 select-none max-w-md mx-auto my-8">
      <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 border border-destructive/20 text-destructive mb-4">
        <AlertOctagon className="size-5" aria-hidden="true" />
      </div>
      
      <h3 className="text-sm font-medium text-foreground tracking-tight">
        Failed to fetch trust metrics
      </h3>
      
      <p className="text-xs text-muted-foreground/80 mt-1 max-w-[280px] leading-relaxed">
        {err?.message || "An error occurred while communicating with the NEURA verification services."}
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
