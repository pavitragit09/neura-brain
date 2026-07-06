"use client";

import { ErrorState } from "@/components/ui/error-state";

type ApiFetchError = {
  status?: number;
  message?: string;
};

type ConnectorErrorProps = {
  error?: Error | ApiFetchError | null | unknown;
  onRetry: () => void;
};

export function ConnectorError({ error, onRetry }: ConnectorErrorProps) {
  return (
    <ErrorState
      title="Failed to sync network"
      description="An error occurred while communicating with the document ingestion APIs."
      error={error}
      retryText="Retry Synchronization"
      onRetry={onRetry}
    />
  );
}
