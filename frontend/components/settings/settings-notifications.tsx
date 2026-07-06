"use client";

import { useSettingsStore } from "@/store/settings-store";

export function SettingsNotifications() {
  const {
    emailNotifications,
    reviewReminders,
    connectorAlerts,
    failedSyncAlerts,
    weeklySummary,
    setNotifications,
  } = useSettingsStore();

  const toggleItems = [
    {
      id: "emailNotifications" as const,
      label: "Email Notifications",
      description: "Receive general email notifications for workspace events.",
      checked: emailNotifications,
    },
    {
      id: "reviewReminders" as const,
      label: "Review Queue Reminders",
      description: "Get notified when generated SOP assets are placed in the human verification queue.",
      checked: reviewReminders,
    },
    {
      id: "connectorAlerts" as const,
      label: "Connector Status Alerts",
      description: "Receive updates when new integrations are connected or modified.",
      checked: connectorAlerts,
    },
    {
      id: "failedSyncAlerts" as const,
      label: "Sync Failure Warning Alerts",
      description: "Get immediate notifications if any data sync jobs fail or timeout.",
      checked: failedSyncAlerts,
    },
    {
      id: "weeklySummary" as const,
      label: "Weekly Knowledge Ingestion Summary",
      description: "A weekly digestible email breakdown of all successfully imported knowledge assets.",
      checked: weeklySummary,
    },
  ];

  return (
    <div className="space-y-6 max-w-lg select-none">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground/90">Notification Preferences</h3>
        <p className="text-xs text-muted-foreground/75 leading-relaxed">
          Configure email triggers, queue notifications, and automated pipeline status warnings.
        </p>
      </div>

      <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 space-y-4">
        {toggleItems.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0 ${
              index > 0 ? "border-t border-border/10" : ""
            }`}
          >
            <div className="space-y-0.5 leading-none">
              <label
                htmlFor={`toggle-${item.id}`}
                className="text-xs font-semibold text-foreground/90 cursor-pointer"
              >
                {item.label}
              </label>
              <p className="text-[11px] text-muted-foreground/80 leading-normal max-w-[320px] mt-1 select-text">
                {item.description}
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              id={`toggle-${item.id}`}
              type="button"
              role="switch"
              aria-checked={item.checked}
              onClick={() => setNotifications({ [item.id]: !item.checked })}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                item.checked ? "bg-primary" : "bg-muted/70"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  item.checked ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
