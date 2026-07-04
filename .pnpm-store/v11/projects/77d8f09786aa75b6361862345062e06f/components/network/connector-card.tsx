"use client";

import {
  FileText,
  Mail,
  GitBranch,
  MessageSquare,
  BookOpen,
  Trello,
  Users,
  HardDrive,
  Calendar,
  Layers,
} from "lucide-react";
import type { ConnectorItem } from "@/types/knowledge";
import { ConnectorStatus } from "./connector-status";
import { Button } from "@/components/ui/button";

type ConnectorCardProps = {
  connector: ConnectorItem;
  onClick: () => void;
};

export function ConnectorCard({ connector, onClick }: ConnectorCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "pdf":
        return FileText;
      case "gdrive":
      case "onedrive":
      case "box":
      case "dropbox":
        return HardDrive;
      case "slack":
        return MessageSquare;
      case "github":
        return GitBranch;
      case "gmail":
        return Mail;
      case "notion":
      case "confluence":
      case "sharepoint":
        return BookOpen;
      case "jira":
        return Trello;
      case "teams":
        return Users;
      case "calendar":
        return Calendar;
      default:
        return Layers;
    }
  };

  const IconComponent = getIcon(connector.icon);
  const isComingSoon = connector.status === "coming_soon";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Inspect ${connector.name} connector. Status: ${connector.status}. Description: ${connector.description}`}
      className="group flex flex-col gap-4 rounded-xl border border-border/30 bg-card p-5 shadow-sm/5 hover:-translate-y-0.5 hover:shadow-md/5 transition-all duration-150 ease-out cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/70 border border-border/20 text-muted-foreground/80 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors duration-150">
          <IconComponent className="size-4" />
        </div>
        <ConnectorStatus status={connector.status} />
      </div>

      {/* Info block */}
      <div className="space-y-1 leading-tight flex-1">
        <h4 className="text-[13px] font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-150">
          {connector.name}
        </h4>
        <p className="text-[11px] text-muted-foreground/75 leading-relaxed">
          {connector.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-3 border-t border-border/15 flex items-center justify-between">
        <div className="min-w-0">
          {!isComingSoon && connector.assetsCount !== undefined ? (
            <span className="text-[10px] text-muted-foreground/80 leading-none">
              {connector.assetsCount} Knowledge Assets
            </span>
          ) : (
            <span className="text-[9px] font-mono text-muted-foreground/50 select-none">
              No active context
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-6.5 text-[10px] px-2.5 rounded bg-secondary hover:bg-secondary/80 text-foreground cursor-pointer select-none"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {isComingSoon ? "Explore" : "Manage"}
        </Button>
      </div>
    </div>
  );
}
