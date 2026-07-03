"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PIPELINE_STAGE_INTERVAL_MS,
  STREAMING_CHAR_INTERVAL_MS,
  advancePipelineStage,
  completePipeline,
  createInitialPipeline,
} from "@/lib/search/pipeline";
import { submitSearchQuery } from "@/services/search";
import type { PipelineStage, SearchQueryResponse } from "@/types/search";

type UseSearchOptions = {
  onInvestigationStart?: () => void;
};

export function useSearch(options: UseSearchOptions = {}) {
  const [pipeline, setPipeline] = useState<PipelineStage[]>(createInitialPipeline);
  const [streamedAnswer, setStreamedAnswer] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const pipelineTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (pipelineTimerRef.current) {
      clearInterval(pipelineTimerRef.current);
      pipelineTimerRef.current = null;
    }

    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const startPipelineAnimation = useCallback(() => {
    setPipeline(createInitialPipeline());
    let stageIndex = 0;

    pipelineTimerRef.current = setInterval(() => {
      stageIndex += 1;

      if (stageIndex >= 5) {
        if (pipelineTimerRef.current) {
          clearInterval(pipelineTimerRef.current);
          pipelineTimerRef.current = null;
        }
        return;
      }

      setPipeline((current) => advancePipelineStage(current, stageIndex));
    }, PIPELINE_STAGE_INTERVAL_MS);
  }, []);

  const startStreamingAnswer = useCallback((answer: string) => {
    setStreamedAnswer("");
    setIsStreaming(true);

    let index = 0;
    streamTimerRef.current = setInterval(() => {
      index += 1;
      setStreamedAnswer(answer.slice(0, index));

      if (index >= answer.length) {
        if (streamTimerRef.current) {
          clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
        }
        setIsStreaming(false);
      }
    }, STREAMING_CHAR_INTERVAL_MS);
  }, []);

  const mutation = useMutation({
    mutationFn: submitSearchQuery,
    onMutate: () => {
      options.onInvestigationStart?.();
      setStreamedAnswer("");
      setIsStreaming(false);
      startPipelineAnimation();
    },
    onSuccess: (data: SearchQueryResponse) => {
      clearTimers();
      setPipeline((current) => completePipeline(current));
      startStreamingAnswer(data.answer);
    },
    onError: () => {
      clearTimers();
      setPipeline(createInitialPipeline());
      setStreamedAnswer("");
      setIsStreaming(false);
    },
  });

  const resetSearch = useCallback(() => {
    clearTimers();
    mutation.reset();
    setPipeline(createInitialPipeline());
    setStreamedAnswer("");
    setIsStreaming(false);
  }, [clearTimers, mutation]);

  return {
    submitQuestion: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    pipeline,
    streamedAnswer,
    isStreaming,
    resetSearch,
  };
}
