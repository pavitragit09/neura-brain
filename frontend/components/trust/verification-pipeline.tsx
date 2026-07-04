"use client";

import type { VerificationStageItem } from "@/types/knowledge";
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type VerificationPipelineProps = {
  stages: VerificationStageItem[];
  overallStatus: string;
};

export function VerificationPipeline({ stages, overallStatus }: VerificationPipelineProps) {
  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="size-4.5 text-emerald-500 shrink-0" />;
      case "active":
        return <Loader2 className="size-4.5 text-blue-500 animate-spin shrink-0" />;
      case "failed":
        return <XCircle className="size-4.5 text-destructive shrink-0" />;
      default:
        return <Circle className="size-4.5 text-muted-foreground/45 shrink-0" />;
    }
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-border/10 pb-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 px-0.5">
          Verification Pipeline
        </h4>
        <span
          className={cn(
            "text-[9px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full border",
            overallStatus === "completed"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
              : overallStatus === "failed"
              ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/10"
              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/10"
          )}
        >
          {overallStatus === "completed" ? "Verified" : overallStatus === "failed" ? "Failed" : "Pending Ingestion"}
        </span>
      </div>

      <div className="relative border-l border-border/30 pl-4.5 ml-2.5 space-y-5">
        {stages.map((stage) => {
          const isPending = stage.status === "pending";
          const isActive = stage.status === "active";

          return (
            <div key={stage.stage_id} className="relative">
              {/* Timeline marker */}
              <span className="absolute -left-[29px] top-0.5 flex size-5.5 items-center justify-center rounded-full bg-background border border-border/40 shadow-sm/5">
                {getStageIcon(stage.status)}
              </span>

              {/* Stage description */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-2 leading-none">
                  <span
                    className={cn(
                      "text-[11px] font-medium transition-colors",
                      isPending ? "text-muted-foreground/75" : "text-foreground/90",
                      isActive && "text-blue-600 dark:text-blue-400 font-semibold"
                    )}
                  >
                    {stage.label}
                  </span>
                </div>
                {stage.details && (
                  <p className="text-[10px] text-muted-foreground/80 leading-normal">
                    {stage.details}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
