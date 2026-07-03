"use client";

import { Grid, List } from "lucide-react";
import { SearchInput } from "@/components/search/search-input";
import { cn } from "@/lib/utils";

type KnowledgeToolbarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: string;
  onSortChange: (value: string) => void;
};

export function KnowledgeToolbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
}: KnowledgeToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/20 pb-4 select-none">
      {/* Title block */}
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight text-foreground/90">Knowledge Library</h2>
        <p className="text-xs text-muted-foreground/75 font-normal">
          Browse and inspect verified organizational procedures.
        </p>
      </div>

      {/* Action block */}
      <div className="flex flex-wrap items-center gap-2.5 sm:w-auto">
        {/* Search */}
        <div className="w-full sm:w-[220px]">
          <SearchInput
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents…"
            showShortcut={false}
            className="h-8.5 rounded-lg border-border/35 text-xs bg-card"
          />
        </div>

        {/* Sort select */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-8.5 rounded-lg border border-border/30 bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
            aria-label="Sort documents"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="confidence">Highest Confidence</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg border border-border/30 bg-card p-0.5 gap-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-1 rounded-md text-muted-foreground transition-colors cursor-pointer",
              viewMode === "grid" && "bg-secondary text-foreground"
            )}
            aria-label="Grid view"
            title="Grid view"
          >
            <Grid className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "p-1 rounded-md text-muted-foreground transition-colors cursor-pointer",
              viewMode === "list" && "bg-secondary text-foreground"
            )}
            aria-label="List view"
            title="List view"
          >
            <List className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
