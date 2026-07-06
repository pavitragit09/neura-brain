"use client";

import { SearchInput } from "@/components/search/search-input";
import { cn } from "@/lib/utils";

export type FilterCategory =
  | "all"
  | "reviews"
  | "uploads"
  | "verification"
  | "connectors"
  | "approvals"
  | "contradictions";

type ActivityFiltersProps = {
  category: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export function ActivityFilters({
  category,
  onCategoryChange,
  searchQuery,
  onSearchQueryChange,
}: ActivityFiltersProps) {
  const categories: { label: string; value: FilterCategory }[] = [
    { label: "All Events", value: "all" },
    { label: "Uploads", value: "uploads" },
    { label: "Reviews", value: "reviews" },
    { label: "Verification", value: "verification" },
    { label: "Connectors", value: "connectors" },
    { label: "Approvals", value: "approvals" },
    { label: "Contradictions", value: "contradictions" },
  ];

  return (
    <div className="flex flex-col gap-4.5 select-none md:flex-row md:items-center md:justify-between border-b border-border/15 pb-4.5">
      {/* Search Bar */}
      <div className="w-full md:max-w-xs shrink-0">
        <SearchInput
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Filter activity history..."
        />
      </div>

      {/* Filter Category Badges */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = category === cat.value;

          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                "h-7.5 px-3 rounded-full text-[11px] font-medium transition-all duration-150 ease-out border cursor-pointer select-none whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm/5"
                  : "bg-secondary/40 hover:bg-secondary/85 text-muted-foreground hover:text-foreground border-border/20"
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
