import { MessageSquare } from "lucide-react";
import { recentConversations } from "@/lib/mock/home-data";

export function RecentConversations() {
  return (
    <section aria-label="Recent conversations" className="flex flex-col gap-3.5">
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80 px-1 select-none">
        Recent conversations
      </h3>
      <div className="rounded-xl border border-border/30 bg-card p-5 shadow-sm/5 transition-all duration-200 hover:shadow-md/5">
        <ul className="flex flex-col gap-3">
          {recentConversations.map((item) => (
            <li key={item.id}>
              <div className="group flex items-start gap-3 rounded-lg p-2 -m-2 hover:bg-secondary/45 transition-colors duration-150 cursor-pointer">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary/70 border border-border/20 text-muted-foreground/80 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors duration-150">
                  <MessageSquare className="size-3.5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 leading-normal">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13px] font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-150">
                      {item.title}
                    </p>
                    <span className="shrink-0 text-[9px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/5 select-none" title="AI Verification Confidence">
                      96% trust
                    </span>
                  </div>
                  <p className="line-clamp-1 text-[11px] text-muted-foreground/85 mt-0.5">
                    {item.preview}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1 select-none font-mono">
                    {item.timestamp}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
