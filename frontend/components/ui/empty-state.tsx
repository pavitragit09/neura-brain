"use client";

import { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon,
  iconBgColor = "bg-secondary/60 border border-border/20 text-muted-foreground/80",
  iconColor = "size-5",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/40 rounded-xl bg-card/45 select-none">
      <div className={`flex size-10 items-center justify-center rounded-lg ${iconBgColor} mb-4`}>
        <Icon className={iconColor} aria-hidden="true" />
      </div>
      <h3 className="text-sm font-medium text-foreground/90 tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground/75 mt-1 max-w-[280px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
