"use client";

import { ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function TrustEmpty() {
  return (
    <EmptyState
      title="Queue Verification Clear"
      description="All generated knowledge assets are successfully verified and synced. No SOPs require human review."
      icon={ShieldAlert}
      iconBgColor="bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    />
  );
}
