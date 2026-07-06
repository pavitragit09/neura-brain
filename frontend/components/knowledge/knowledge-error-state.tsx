"use client";

import { ErrorState } from "@/components/ui/error-state";

type ApiFetchError = {
  status?: number;
  message?: string;
};

type KnowledgeErrorStateProps = {
  error?: Error | ApiFetchError | null | unknown;
  onRetry: () => void;
};

export function KnowledgeErrorState({ error, onRetry }: KnowledgeErrorStateProps) {
  const err = error as ApiFetchError | null;
  const isUnauthorized = err?.status === 401;

  return (
    <ErrorState
      title={isUnauthorized ? "Authorization Required" : "Failed to load knowledge"}
      description={
        isUnauthorized
          ? "You must be signed in with a valid session to view organizational knowledge assets."
          : "An error occurred while fetching documents from the backend server."
      }
      error={error}
      onRetry={onRetry}
    />
  );
}
