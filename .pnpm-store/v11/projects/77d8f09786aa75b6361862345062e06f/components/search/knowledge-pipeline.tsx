import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineStage } from "@/types/search";

type KnowledgePipelineProps = {
  stages: PipelineStage[];
  compact?: boolean;
};

export function KnowledgePipeline({ stages, compact = false }: KnowledgePipelineProps) {
  return (
    <div
      aria-label="Knowledge pipeline"
      className={cn(
        "overflow-x-auto",
        compact ? "py-1" : "rounded-lg border bg-card px-4 py-3 shadow-sm",
      )}
    >
      <ol className="flex min-w-max items-center gap-2 sm:gap-3">
        {stages.map((stage, index) => (
          <li key={stage.id} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-2 shrink-0 rounded-full transition-colors duration-200",
                  stage.status === "complete" && "bg-primary",
                  stage.status === "active" && "bg-primary animate-pulse",
                  stage.status === "pending" && "bg-muted-foreground/30",
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-200 sm:text-sm",
                  stage.status === "complete" && "text-foreground",
                  stage.status === "active" && "text-foreground",
                  stage.status === "pending" && "text-muted-foreground",
                )}
              >
                {stage.label}
              </span>
              {stage.status === "complete" ? (
                <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" />
              ) : null}
            </div>
            {index < stages.length - 1 ? (
              <span className="text-muted-foreground/40" aria-hidden="true">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
