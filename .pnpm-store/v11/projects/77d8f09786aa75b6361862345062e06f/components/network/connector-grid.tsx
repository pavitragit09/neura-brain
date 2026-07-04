"use client";

import type { ConnectorItem } from "@/types/knowledge";
import { ConnectorCard } from "./connector-card";
import { ConnectorEmpty } from "./connector-empty";

type ConnectorGridProps = {
  connectors: ConnectorItem[];
  onCardClick: (connector: ConnectorItem) => void;
  searchQuery: string;
};

export function ConnectorGrid({ connectors, onCardClick, searchQuery }: ConnectorGridProps) {
  if (connectors.length === 0) {
    return <ConnectorEmpty searchQuery={searchQuery} />;
  }

  // Define Category Headers
  const categoryLabels = {
    documents: "Document Systems",
    collaboration: "Collaboration & Communication",
    knowledge: "Knowledge Bases & Wikis",
    engineering: "Engineering Context",
  };

  // Group items by category
  const categories: Record<string, ConnectorItem[]> = {
    documents: [],
    collaboration: [],
    knowledge: [],
    engineering: [],
  };

  connectors.forEach((conn) => {
    if (categories[conn.category]) {
      categories[conn.category].push(conn);
    }
  });

  return (
    <div className="space-y-8 select-none">
      {Object.entries(categories).map(([catKey, items]) => {
        if (items.length === 0) {
          return null;
        }

        const label = categoryLabels[catKey as keyof typeof categoryLabels] || catKey;

        return (
          <section key={catKey} className="space-y-3" aria-labelledby={`cat-title-${catKey}`}>
            <h3
              id={`cat-title-${catKey}`}
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 px-0.5"
            >
              {label}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((conn) => (
                <ConnectorCard
                  key={conn.id}
                  connector={conn}
                  onClick={() => onCardClick(conn)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
