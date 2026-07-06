"use client";

import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

type FetchError = {
  status?: number;
  message?: string;
};

type ErrorStateProps = {
  title: string;
  description: string;
  error?: Error | FetchError | null | unknown;
  retryText?: string;
  onRetry: () => void;
};

export function ErrorState({
  title,
  description,
  error,
  retryText = "Retry Connection",
  onRetry,
}: ErrorStateProps) {
  const err = error as FetchError | null;
  const displayMsg = err?.message || description;

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-border/30 bg-card rounded-xl shadow-sm/5 select-none max-w-md mx-auto my-8 animate-fade-in">
      <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 border border-destructive/20 text-destructive mb-4">
        <AlertOctagon className="size-5" aria-hidden="true" />
      </div>
      
      <h3 className="text-sm font-medium text-foreground tracking-tight">
        {title}
      </h3>
      
      <p className="text-xs text-muted-foreground/80 mt-1 max-w-[280px] leading-relaxed">
        {displayMsg}
      </p>
      
      <Button
        type="button"
        variant="outline"
        onClick={onRetry}
        className="mt-5 h-9 text-xs px-4 rounded-lg bg-background hover:bg-secondary cursor-pointer"
      >
        {retryText}
      </Button>
    </div>
  );
}
