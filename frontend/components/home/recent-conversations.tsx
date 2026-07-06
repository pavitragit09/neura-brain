"use client";

import { MessageSquare } from "lucide-react";

export function RecentConversations() {
  return (
    <section aria-label="Recent conversations" className="flex flex-col gap-3.5 select-none">
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80 px-1">
        Recent conversations
      </h3>
      <div className="rounded-xl border border-border/30 bg-card p-5 shadow-sm/5 min-h-[160px] flex flex-col items-center justify-center text-center">
        <MessageSquare className="size-5 text-muted-foreground/45 mb-2" />
        <p className="text-[11px] text-muted-foreground/75 leading-normal max-w-[200px]">
          No recent searches. Ask a question to begin a new investigation.
        </p>
      </div>
    </section>
  );
}
