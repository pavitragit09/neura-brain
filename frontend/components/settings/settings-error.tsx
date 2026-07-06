"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type SettingsErrorProps = {
  error: unknown;
  onRetry: () => void;
};

export function SettingsError({ error, onRetry }: SettingsErrorProps) {
  const errorMessage = error instanceof Error ? error.message : "Unable to retrieve settings metadata.";

  return (
    <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-6 max-w-lg select-none text-center space-y-4">
      <AlertTriangle className="size-6 text-red-500 mx-auto" />
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-foreground/90">Settings Sync Failed</h4>
        <p className="text-xs text-muted-foreground/75 max-w-[280px] mx-auto leading-relaxed">
          {errorMessage}
        </p>
      </div>
      <Button
        type="button"
        onClick={onRetry}
        className="h-8.5 px-4 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer select-none"
      >
        Try Again
      </Button>
    </div>
  );
}
