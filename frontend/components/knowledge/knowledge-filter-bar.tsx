"use client";

import { cn } from "@/lib/utils";

export type FilterValue = "all" | "pdf" | "sop" | "verified" | "reviewing" | "failed";

type FilterChip = {
  label: string;
  value: FilterValue;
};

const filterChips: FilterChip[] = [
  { label: "All Assets", value: "all" },
  { label: "PDF Documents", value: "pdf" },
  { label: "Generated SOPs", value: "sop" },
  { label: "Verified Only", value: "verified" },
  { label: "Under Review", value: "reviewing" },
  { label: "Failed Ingestion", value: "failed" },
];

type KnowledgeFilterBarProps = {
  activeFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
};

export function KnowledgeFilterBar({ activeFilter, onFilterChange }: KnowledgeFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 select-none my-1">
      {filterChips.map((chip) => {
        const active = activeFilter === chip.value;
        return (
          <button
            key={chip.value}
            type="button"
            onClick={() => onFilterChange(chip.value)}
            className={cn(
              "h-7 rounded-lg border px-3 text-[11px] font-normal transition-all duration-150 cursor-pointer select-none",
              active
                ? "bg-primary/10 border-primary/25 text-primary font-medium"
                : "bg-secondary/35 border-border/10 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
