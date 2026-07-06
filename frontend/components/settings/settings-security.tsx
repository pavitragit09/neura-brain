"use client";

import { useAuthStore } from "@/store/auth-store";
import { ShieldCheck, Key, ShieldAlert } from "lucide-react";

export function SettingsSecurity() {
  const authUser = useAuthStore((state) => state.user);

  const securityItems = [
    {
      label: "Authentication Mode",
      value: "Bearer Tokens (HTTP Authorization Header)",
      description: "Tokens are passed securely via standard Bearer headers for API requests.",
    },
    {
      label: "Active Session Stamp",
      value: "JWT Active (JSON Web Token)",
      description: "Signed token session tracking currently bypassing token validations locally.",
    },
    {
      label: "User Access Role",
      value: authUser?.role ? authUser.role.toUpperCase() : "ADMIN",
      description: "Current privilege tier. Governs access permissions across routers.",
    },
    {
      label: "Workspace Access Restriction",
      value: "Local Intranet Loopback (Any Connected Host)",
      description: "Configured CORS regex pattern allows access from localhost and private networks.",
    },
    {
      label: "API Authentication Mode",
      value: "Bearer Token Override (JWT bypass enabled)",
      description: "Authentication is temporarily bypassed for dev ease.",
    },
    {
      label: "Development Mode (DEV_MODE)",
      value: "True (Active)",
      description: "FastAPI is running with DEV_MODE=true. Mock sessions are active.",
    },
  ];

  return (
    <div className="space-y-6 max-w-lg select-none">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground/90">Security & Authentication</h3>
        <p className="text-xs text-muted-foreground/75 leading-relaxed">
          Inspect security tokens, active credentials, and audit development bypass settings.
        </p>
      </div>

      {/* Security Status banner */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex gap-3 text-xs leading-relaxed">
        <ShieldCheck className="size-4.5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">Governance Security Shield Engaged</h4>
          <p className="text-muted-foreground/80">
            Cryptographic ledger integrity is active. Ingestion transactions are signed using SHA-256 blocks to prevent modification.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 space-y-4">
        <h4 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75 leading-none mb-1">
          <Key className="size-3.5 text-primary" />
          Active Ingress Sessions
        </h4>

        {securityItems.map((item, index) => (
          <div
            key={item.label}
            className={`space-y-1 py-3 first:pt-0 last:pb-0 ${
              index > 0 ? "border-t border-border/10" : ""
            }`}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 leading-none">
              {item.label}
            </span>
            <span className="block text-xs font-semibold text-foreground/85 font-mono leading-normal pt-0.5">
              {item.value}
            </span>
            <p className="text-[10px] text-muted-foreground/75 leading-normal select-text">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Dev mode warning */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3 text-xs leading-relaxed">
        <ShieldAlert className="size-4.5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-semibold text-amber-600 dark:text-amber-400">Development Mode Notice</h4>
          <p className="text-muted-foreground/80">
            Authorization tokens are bypassed for development. Disable DEV_MODE in the environment to enforce production-grade JWT checking.
          </p>
        </div>
      </div>
    </div>
  );
}
