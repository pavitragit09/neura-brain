"use client";

import { cn } from "@/lib/utils";
import {
  User,
  Palette,
  Bell,
  Building,
  Cpu,
  Link,
  ShieldCheck,
  Info,
} from "lucide-react";

export type SettingsTab =
  | "profile"
  | "appearance"
  | "notifications"
  | "workspace"
  | "ai"
  | "connectors"
  | "security"
  | "about";

type NavigationItem = {
  id: SettingsTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

type SettingsNavigationProps = {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
};

const navigationGroups: NavigationGroup[] = [
  {
    title: "General",
    items: [
      { id: "profile", label: "Profile", icon: User },
      { id: "appearance", label: "Appearance", icon: Palette },
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "Workspace",
    items: [
      { id: "workspace", label: "Workspace Details", icon: Building },
      { id: "ai", label: "AI Preferences", icon: Cpu },
      { id: "connectors", label: "Connectors", icon: Link },
    ],
  },
  {
    title: "System",
    items: [
      { id: "security", label: "Security Status", icon: ShieldCheck },
      { id: "about", label: "About Workspace", icon: Info },
    ],
  },
];

export function SettingsNavigation({ activeTab, onTabChange }: SettingsNavigationProps) {
  return (
    <nav
      aria-label="Settings navigation"
      className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 border-b md:border-b-0 md:border-r border-border/20 pr-0 md:pr-4 shrink-0 md:w-56 select-none"
    >
      {navigationGroups.map((group) => (
        <div key={group.title} className="flex flex-row md:flex-col shrink-0 md:shrink md:space-y-0.5 md:mt-4 first:mt-0">
          <h4 className="hidden md:block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-3.5 mb-2 mt-4 first:mt-0">
            {group.title}
          </h4>
          <div className="flex flex-row md:flex-col gap-1 md:gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  aria-selected={isActive}
                  role="tab"
                  className={cn(
                    "flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground/80 hover:bg-secondary/45 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground/75")} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
