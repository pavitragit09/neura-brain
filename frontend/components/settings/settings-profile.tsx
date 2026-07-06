"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export function SettingsProfile() {
  const { user: authUser, updateProfile } = useAuthStore();

  const [nameInput, setNameInput] = useState(authUser?.name ?? "");
  const [initialsInput, setInitialsInput] = useState(authUser?.initials ?? "");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (authUser) {
      setNameInput(authUser.name);
      setInitialsInput(authUser.initials);
    }
  }, [authUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(nameInput, initialsInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-lg select-none">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground/90">User Profile</h3>
        <p className="text-xs text-muted-foreground/75 leading-relaxed">
          Manage your personal details, avatar configuration, and account permissions.
        </p>
      </div>

      <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 space-y-5">
        {/* Avatar peek */}
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary text-base font-semibold font-mono">
            {initialsInput || "?"}
          </div>
          <div className="space-y-1 leading-none">
            <h4 className="text-xs font-semibold text-foreground/90">Your Avatar</h4>
            <p className="text-[10px] text-muted-foreground/75">
              Derived automatically from your display initials.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="display-name" className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Display Name
            </label>
            <input
              id="display-name"
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full h-9 rounded-lg border border-border/40 bg-background/50 px-3 text-xs text-foreground/90 outline-none focus:border-primary/45 focus:bg-background transition-all duration-150"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="avatar-initials" className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Avatar Initials
            </label>
            <input
              id="avatar-initials"
              type="text"
              maxLength={2}
              required
              value={initialsInput}
              onChange={(e) => setInitialsInput(e.target.value)}
              className="w-full h-9 rounded-lg border border-border/40 bg-background/50 px-3 text-xs text-foreground/90 outline-none focus:border-primary/45 focus:bg-background transition-all duration-150 font-mono"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/20 bg-secondary/15 p-4.5 space-y-3.5 text-xs select-text">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75 leading-none">
          Account Details (Read-only)
        </h4>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="space-y-1">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70 leading-none">
              Email Address
            </span>
            <span className="block font-mono text-foreground/85 leading-normal">
              {authUser?.email ?? "alex@neura.local"}
            </span>
          </div>

          <div className="space-y-1">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70 leading-none">
              Governance Role
            </span>
            <span className="block text-foreground/85 leading-normal capitalize">
              {authUser?.role ?? "administrator"}
            </span>
          </div>

          <div className="space-y-1 col-span-2 border-t border-border/10 pt-2.5">
            <span className="block text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70 leading-none">
              Last Login Security Stamp
            </span>
            <span className="block text-foreground/85 leading-normal font-mono">
              July 6, 2026, 12:51 PM (IST) · Session Active
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          className="h-9 px-5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer select-none"
        >
          Save Changes
        </Button>
        {isSaved && (
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-200">
            Profile saved successfully.
          </span>
        )}
      </div>
    </form>
  );
}
