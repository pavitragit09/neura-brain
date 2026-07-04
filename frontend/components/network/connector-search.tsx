"use client";

import { SearchInput } from "@/components/search/search-input";

type ConnectorSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ConnectorSearch({ value, onChange }: ConnectorSearchProps) {
  return (
    <div className="w-full max-w-[280px] select-none">
      <SearchInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filter connectors…"
        showShortcut={false}
        className="h-8.5 rounded-lg border-border/35 text-xs bg-card"
      />
    </div>
  );
}
