"use client";

import { CalendarDays } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function ActivityEmpty() {
  return (
    <EmptyState
      title="No Events Found"
      description="No activity logs match your selected filter criteria. Try adjusting your search query or categories."
      icon={CalendarDays}
    />
  );
}
