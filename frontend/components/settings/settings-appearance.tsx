"use client";

import { useSettingsStore } from "@/store/settings-store";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function SettingsAppearance() {
  const { theme, setTheme } = useTheme();
  
  const {
    density,
    timezone,
    dateFormat,
    setAppearance,
    resetPreferences,
  } = useSettingsStore();

  const timezones = [
    { label: "India Standard Time (IST - Asia/Kolkata)", value: "Asia/Kolkata" },
    { label: "Coordinated Universal Time (UTC)", value: "UTC" },
    { label: "US Eastern Time (EST - America/New_York)", value: "America/New_York" },
    { label: "Europe Central Time (CET - Europe/London)", value: "Europe/London" },
  ];

  const dateFormats = [
    { label: "5 Jul, 01:38 PM", value: "d MMM, hh:mm A" },
    { label: "05-07-2026 13:38", value: "dd-MM-yyyy HH:mm" },
    { label: "2026/07/05 13:38:12", value: "yyyy/MM/dd HH:mm:ss" },
  ];

  const handleReset = () => {
    resetPreferences();
    setTheme("system");
  };

  return (
    <div className="space-y-6 max-w-lg select-none">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground/90">Appearance & Localization</h3>
        <p className="text-xs text-muted-foreground/75 leading-relaxed">
          Customize themes, spacing density, language translations, and timezone format overlays.
        </p>
      </div>

      <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 space-y-5">
        {/* Theme */}
        <div className="space-y-2">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Interface Theme
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(["system", "light", "dark"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`h-9 text-xs font-semibold rounded-lg border px-3 capitalize transition-all duration-150 cursor-pointer ${
                  theme === t
                    ? "bg-secondary border-primary/20 text-foreground"
                    : "border-border/30 bg-background/30 text-muted-foreground/80 hover:bg-secondary/45"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Spacing Density */}
        <div className="space-y-2 pt-2 border-t border-border/10">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Layout Density
          </span>
          <div className="grid grid-cols-2 gap-2">
            {(["comfortable", "compact"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setAppearance({ density: d })}
                className={`h-9 text-xs font-semibold rounded-lg border px-3 capitalize transition-all duration-150 cursor-pointer ${
                  density === d
                    ? "bg-secondary border-primary/20 text-foreground"
                    : "border-border/30 bg-background/30 text-muted-foreground/80 hover:bg-secondary/45"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Timezone */}
        <div className="space-y-2 pt-2 border-t border-border/10">
          <label htmlFor="timezone-select" className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Workspace Timezone
          </label>
          <select
            id="timezone-select"
            value={timezone}
            onChange={(e) => setAppearance({ timezone: e.target.value })}
            className="w-full h-9 rounded-lg border border-border/40 bg-background/50 px-3 text-xs text-foreground/90 outline-none focus:border-primary/45 focus:bg-background transition-all duration-150 cursor-pointer"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Format */}
        <div className="space-y-2 pt-2 border-t border-border/10">
          <label htmlFor="date-format-select" className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Preferred Date Overlay Format
          </label>
          <select
            id="date-format-select"
            value={dateFormat}
            onChange={(e) => setAppearance({ dateFormat: e.target.value })}
            className="w-full h-9 rounded-lg border border-border/40 bg-background/50 px-3 text-xs text-foreground/90 outline-none focus:border-primary/45 focus:bg-background transition-all duration-150 cursor-pointer"
          >
            {dateFormats.map((df) => (
              <option key={df.value} value={df.value}>
                {df.label}
              </option>
            ))}
          </select>
        </div>

        {/* Language Placeholder */}
        <div className="space-y-2 pt-2 border-t border-border/10">
          <label htmlFor="language-select" className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            System Language
          </label>
          <select
            id="language-select"
            disabled
            value="en"
            className="w-full h-9 rounded-lg border border-border/40 bg-background/50 px-3 text-xs text-muted-foreground/70 cursor-not-allowed select-none"
          >
            <option value="en">English (US/UK) - Active</option>
            <option value="es">Spanish (Español) - Future</option>
            <option value="de">German (Deutsch) - Future</option>
            <option value="ja">Japanese (日本語) - Future</option>
          </select>
        </div>
      </div>

      {/* Reset Preferences card */}
      <div className="rounded-xl border border-dashed border-red-500/30 bg-red-500/5 p-5 space-y-3.5">
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold text-red-600 dark:text-red-400">Reset Local Preferences</h4>
          <p className="text-[11px] text-muted-foreground/75 leading-relaxed">
            Restores all settings, theme preferences, layout density toggles, and notification options back to their original factory defaults. This action is irreversible.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleReset}
          className="h-8 px-4.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer select-none"
        >
          Reset Preferences
        </Button>
      </div>
    </div>
  );
}
