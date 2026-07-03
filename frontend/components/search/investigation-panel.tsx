"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CitationsList } from "@/components/search/citations-list";
import { EvidenceStrip } from "@/components/search/evidence-strip";
import { KnowledgePipeline } from "@/components/search/knowledge-pipeline";
import { RelatedKnowledge } from "@/components/search/related-knowledge";
import { SearchInput } from "@/components/search/search-input";
import { StreamingAnswer } from "@/components/search/streaming-answer";
import { Button } from "@/components/ui/button";
import type { SearchQueryResponse } from "@/types/search";
import type { PipelineStage } from "@/types/search";

type InvestigationPanelProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (question: string) => void;
  onFollowUpSelect: (question: string) => void;
  pipeline: PipelineStage[];
  data?: SearchQueryResponse;
  streamedAnswer: string;
  isStreaming: boolean;
  isPending: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
};

const transition = { duration: 0.22, ease: "easeOut" as const };

export function InvestigationPanel({
  query,
  onQueryChange,
  onSubmit,
  onFollowUpSelect,
  pipeline,
  data,
  streamedAnswer,
  isStreaming,
  isPending,
  isError,
  errorMessage,
  onRetry,
}: InvestigationPanelProps) {
  const showEvidence = isPending || Boolean(data);
  const showAnswer = isPending || Boolean(data);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed || isPending) {
      return;
    }

    onSubmit(trimmed);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="flex w-full flex-col gap-6"
    >
      <form onSubmit={handleSubmit} className="sticky top-0 z-10 bg-background pb-2">
        <SearchInput
          size="hero"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Ask anything about your organization…"
          aria-label="Search knowledge"
          autoFocus
          disabled={isPending}
        />
      </form>

      <KnowledgePipeline stages={pipeline} />

      <AnimatePresence mode="wait">
        {isError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="rounded-lg border border-destructive/30 bg-card p-4"
          >
            <p className="text-sm font-medium">We couldn&apos;t complete this request.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {errorMessage ?? "Knowledge service unavailable."}
            </p>
            <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onRetry}>
              Retry
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {isPending || showEvidence ? (
        <EvidenceStrip
          sourceCount={data?.source_count ?? 0}
          confidenceScore={data?.confidence_score ?? 0}
          isLoading={isPending}
        />
      ) : null}

      {showAnswer || isPending ? (
        <StreamingAnswer
          question={query}
          answer={streamedAnswer}
          isStreaming={isStreaming}
          isLoading={isPending}
          timestamp={data ? "Just now" : undefined}
        />
      ) : null}

      {data && !isPending && data.source_count === 0 ? (
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium">No verified knowledge was found for this question.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Try broader wording.</li>
            <li>Check if the document has been imported.</li>
            <li>Contact an administrator.</li>
          </ul>
        </div>
      ) : null}

      {data && !isPending ? <CitationsList sources={data.sources} /> : null}

      {data && !isPending ? (
        <RelatedKnowledge items={data.related_knowledge} onSelect={onFollowUpSelect} />
      ) : null}

      {data?.follow_up_questions.length ? (
        <section aria-label="Suggested follow-up questions" className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Suggested follow-ups</h3>
          <ul className="flex flex-wrap gap-2">
            {data.follow_up_questions.map((question) => (
              <li key={question}>
                <button
                  type="button"
                  onClick={() => onFollowUpSelect(question)}
                  className="rounded-full border bg-background px-3.5 py-2 text-sm transition-colors duration-200 hover:bg-accent"
                >
                  {question}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </motion.div>
  );
}
