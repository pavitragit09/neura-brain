"use client";

import { ErrorState } from "@/components/ui/error-state";

type ActivityFetchError = {
  status?: number;
  message?: string;
};

type ActivityErrorProps = {
  error?: Error | ActivityFetchError | null | unknown;
  onRetry: () => void;
};

export function ActivityError({ error, onRetry }: ActivityErrorProps) {
  return (
    <ErrorState
      title="Failed to fetch activity logs"
      description="An error occurred while communicating with the NEURA auditing services."
      error={error}
      onRetry={onRetry}
    />
  );
}
