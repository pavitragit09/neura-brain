"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AdminWidgets } from "@/components/home/admin-widgets";
import { HomeGreeting } from "@/components/home/home-greeting";
import { RecentConversations } from "@/components/home/recent-conversations";
import { RecentKnowledge } from "@/components/home/recent-knowledge";
import { SuggestedQuestions } from "@/components/home/suggested-questions";
import { InvestigationPanel } from "@/components/search/investigation-panel";
import { SearchInput } from "@/components/search/search-input";
import { useSearch } from "@/hooks/use-search";

const transition = { duration: 0.16, ease: [0.16, 1, 0.3, 1] as const };

export function HomeWorkspace() {
  const [mode, setMode] = useState<"discovery" | "investigation">("discovery");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    submitQuestion,
    isPending,
    isError,
    error,
    data,
    pipeline,
    streamedAnswer,
    isStreaming,
  } = useSearch({
    onInvestigationStart: () => setMode("investigation"),
  });

  const handleSubmit = useCallback(
    (question: string) => {
      setQuery(question);
      submitQuestion({ question });
    },
    [submitQuestion],
  );

  function handleDiscoverySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    handleSubmit(trimmed);
  }

  function handleFollowUpSelect(question: string) {
    setQuery(question);
    handleSubmit(question);
  }

  function handleRetry() {
    const trimmed = query.trim();

    if (trimmed) {
      handleSubmit(trimmed);
    }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape" && mode === "discovery") {
        setQuery("");
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-8 pt-2 sm:gap-10 sm:pt-6">
      <AnimatePresence mode="wait">
        {mode === "discovery" ? (
          <motion.div
            key="discovery"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={transition}
            className="flex flex-col gap-8 sm:gap-10"
          >
            <HomeGreeting />

            <form onSubmit={handleDiscoverySubmit} className="w-full">
              <SearchInput
                ref={inputRef}
                size="hero"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask anything about your organization…"
                aria-label="Search knowledge"
              />
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/75 select-none -mt-4.5">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>Citations and cross-referenced evidence are automatically attached to answers.</span>
            </div>

            <SuggestedQuestions onSelect={handleSubmit} />

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <RecentKnowledge />
              <RecentConversations />
            </div>

            <AdminWidgets />
          </motion.div>
        ) : (
          <motion.div
            key="investigation"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
          >
            <InvestigationPanel
              query={query}
              onQueryChange={setQuery}
              onSubmit={handleSubmit}
              onFollowUpSelect={handleFollowUpSelect}
              pipeline={pipeline}
              data={data}
              streamedAnswer={streamedAnswer}
              isStreaming={isStreaming}
              isPending={isPending}
              isError={isError}
              errorMessage={error?.message}
              onRetry={handleRetry}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
