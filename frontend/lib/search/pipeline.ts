import type { PipelineStage, PipelineStageId, PipelineStageStatus } from "@/types/search";
import { PIPELINE_STAGES } from "@/types/search";

export function createInitialPipeline(): PipelineStage[] {
  return PIPELINE_STAGES.map((stage, index) => ({
    ...stage,
    status: index === 0 ? "active" : "pending",
  }));
}

export function advancePipelineStage(
  stages: PipelineStage[],
  activeIndex: number,
): PipelineStage[] {
  return stages.map((stage, index) => {
    if (index < activeIndex) {
      return { ...stage, status: "complete" as PipelineStageStatus };
    }

    if (index === activeIndex) {
      return { ...stage, status: "active" as PipelineStageStatus };
    }

    return { ...stage, status: "pending" as PipelineStageStatus };
  });
}

export function completePipeline(stages: PipelineStage[]): PipelineStage[] {
  return stages.map((stage) => ({ ...stage, status: "complete" as PipelineStageStatus }));
}

export function getPipelineStageIndex(stageId: PipelineStageId) {
  return PIPELINE_STAGES.findIndex((stage) => stage.id === stageId);
}

export const PIPELINE_STAGE_INTERVAL_MS = 450;

export const STREAMING_CHAR_INTERVAL_MS = 12;
