"use client";

import { forwardRef } from "react";
import { SearchInput } from "@/components/search/search-input";

type HeroSearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  disabled?: boolean;
};

export const HeroSearchBar = forwardRef<HTMLInputElement, HeroSearchBarProps>(
  ({ value, onChange, onSubmit, disabled }, ref) => {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const trimmed = value?.trim();

      if (trimmed) {
        onSubmit?.(trimmed);
      }
    }

    return (
      <section aria-label="Search knowledge" className="w-full">
        <form onSubmit={handleSubmit}>
          <SearchInput
            ref={ref}
            size="hero"
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder="Ask anything about your organization…"
            disabled={disabled}
            readOnly={!onChange}
          />
        </form>
      </section>
    );
  },
);
HeroSearchBar.displayName = "HeroSearchBar";
