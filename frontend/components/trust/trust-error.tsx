"use client";

import { ErrorState } from "@/components/ui/error-state";

type TrustFetchError = {
  status?: number;
  message?: string;
};

type TrustErrorProps = {
  error?: Error | TrustFetchError | null | unknown;
  onRetry: () => void;
};

export function TrustError({ error, onRetry }: TrustErrorProps) {
  return (
    <ErrorState
      title="Failed to fetch trust metrics"
      description="An error occurred while communicating with the NEURA verification services."
      error={error}
      onRetry={onRetry}
    />
  );
}
