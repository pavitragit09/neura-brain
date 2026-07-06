"use client";

import { useState } from "react";
import { SettingsNavigation, SettingsTab } from "@/components/settings/settings-navigation";
import { SettingsProfile } from "@/components/settings/settings-profile";
import { SettingsWorkspace } from "@/components/settings/settings-workspace";
import { SettingsAppearance } from "@/components/settings/settings-appearance";
import { SettingsNotifications } from "@/components/settings/settings-notifications";
import { SettingsAi } from "@/components/settings/settings-ai";
import { SettingsSecurity } from "@/components/settings/settings-security";
import { SettingsConnectors } from "@/components/settings/settings-connectors";
import { SettingsAbout } from "@/components/settings/settings-about";
import { useSettingsStore } from "@/store/settings-store";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const { density } = useSettingsStore();

  // Mobile Accordion open/close state
  const [expandedSection, setExpandedSection] = useState<SettingsTab | null>("profile");

  const renderActiveTabContent = (tab: SettingsTab) => {
    switch (tab) {
      case "profile":
        return <SettingsProfile />;
      case "workspace":
        return <SettingsWorkspace />;
      case "appearance":
        return <SettingsAppearance />;
      case "notifications":
        return <SettingsNotifications />;
      case "ai":
        return <SettingsAi />;
      case "security":
        return <SettingsSecurity />;
      case "connectors":
        return <SettingsConnectors />;
      case "about":
        return <SettingsAbout />;
    }
  };

  const sectionsList: { id: SettingsTab; label: string }[] = [
    { id: "profile", label: "User Profile" },
    { id: "appearance", label: "Appearance & Localization" },
    { id: "notifications", label: "Notifications Preferences" },
    { id: "workspace", label: "Workspace Details" },
    { id: "ai", label: "AI Preferences" },
    { id: "connectors", label: "Connector Preferences" },
    { id: "security", label: "Security Status" },
    { id: "about", label: "About Workspace" },
  ];

  const handleToggleAccordion = (id: SettingsTab) => {
    if (expandedSection === id) {
      setExpandedSection(null);
    } else {
      setExpandedSection(id);
    }
  };

  return (
    <div className={`space-y-6 ${density === "compact" ? "p-3 space-y-4" : "p-6"}`}>
      {/* Title Header Block */}
      <div className="border-b border-border/20 pb-4 select-none">
        <h2 className="text-xl font-medium tracking-tight text-foreground/90">Settings</h2>
        <p className="text-xs text-muted-foreground/75 font-normal max-w-[480px] mt-0.5 leading-relaxed">
          Manage your workspace, organization, AI preferences, security, and user profile.
        </p>
      </div>

      {/* Desktop side-by-side panel */}
      <div className="hidden md:flex gap-6 items-start">
        <SettingsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main
          role="tabpanel"
          aria-label={`${activeTab} Settings`}
          className="flex-1 min-w-0"
        >
          {renderActiveTabContent(activeTab)}
        </main>
      </div>

      {/* Mobile Accordion View (< md) */}
      <div className="flex md:hidden flex-col gap-3 select-none">
        {sectionsList.map((sec) => {
          const isOpen = expandedSection === sec.id;
          return (
            <div key={sec.id} className="rounded-xl border border-border/30 bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => handleToggleAccordion(sec.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-4 text-xs font-semibold text-foreground/90 hover:bg-secondary/20 cursor-pointer outline-none transition-colors"
              >
                <span>{sec.label}</span>
                {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>
              {isOpen && (
                <div className="p-4 border-t border-border/20 bg-background/25">
                  {renderActiveTabContent(sec.id)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
