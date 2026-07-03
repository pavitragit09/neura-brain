import { FileText } from "lucide-react";
import { recentKnowledge } from "@/lib/mock/home-data";

export function RecentKnowledge() {
  return (
    <section aria-label="Recent knowledge" className="flex flex-col gap-3.5">
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80 px-1 select-none">
        Recent knowledge
      </h3>
      <div className="rounded-xl border border-border/30 bg-card p-5 shadow-sm/5 transition-all duration-200 hover:shadow-md/5">
        <ul className="flex flex-col gap-3">
          {recentKnowledge.map((item) => (
            <li key={item.id}>
              <div className="group flex items-start gap-3 rounded-lg p-2 -m-2 hover:bg-secondary/45 transition-colors duration-150 cursor-pointer">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary/70 border border-border/20 text-muted-foreground/80 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors duration-150">
                  <FileText className="size-3.5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 leading-tight mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[13px] font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-150">
                      {item.title}
                    </p>
                    <span className="shrink-0 inline-flex size-3.5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/5 select-none" title="Verified knowledge asset">
                      <svg className="size-2 fill-current" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                      </svg>
                    </span>
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground/80 mt-1 select-none">
                    {item.source} <span className="text-muted-foreground/30 font-mono">/</span> {item.updatedAt}
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
