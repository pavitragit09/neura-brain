"use client";

import { AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

type ApiFetchError = {
  status?: number;
  message?: string;
};

type KnowledgeErrorStateProps = {
  error?: Error | ApiFetchError | null | unknown;
  onRetry: () => void;
};

export function KnowledgeErrorState({ error, onRetry }: KnowledgeErrorStateProps) {
  // Cast helper for type-safety
  const err = error as ApiFetchError | null;
  const isUnauthorized = err?.status === 401;

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-border/30 bg-card rounded-xl shadow-sm/5 select-none max-w-md mx-auto my-8">
      <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 border border-destructive/20 text-destructive mb-4">
        {isUnauthorized ? (
          <Lock className="size-5" aria-hidden="true" />
        ) : (
          <AlertCircle className="size-5" aria-hidden="true" />
        )}
      </div>
      
      <h3 className="text-sm font-medium text-foreground tracking-tight">
        {isUnauthorized ? "Authorization Required" : "Failed to load knowledge"}
      </h3>
      
      <p className="text-xs text-muted-foreground/80 mt-1 max-w-[280px] leading-relaxed">
        {isUnauthorized
          ? "You must be signed in with a valid session to view organizational knowledge assets."
          : err?.message || "An error occurred while fetching documents from the backend server."}
      </p>
      
      <Button
        type="button"
        variant="outline"
        onClick={onRetry}
        className="mt-5 h-9 text-xs px-4 rounded-lg bg-background hover:bg-secondary cursor-pointer"
      >
        {isUnauthorized ? "Sign In Again" : "Try Again"}
      </Button>
    </div>
  );
}
