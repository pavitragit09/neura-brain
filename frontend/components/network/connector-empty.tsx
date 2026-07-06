"use client";

import { Link2Off } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

type ConnectorEmptyProps = {
  searchQuery: string;
};

export function ConnectorEmpty({ searchQuery }: ConnectorEmptyProps) {
  return (
    <EmptyState
      title="No Connectors Found"
      description={`No integration channels matched your filter criteria for "${searchQuery}".`}
      icon={Link2Off}
    />
  );
}
