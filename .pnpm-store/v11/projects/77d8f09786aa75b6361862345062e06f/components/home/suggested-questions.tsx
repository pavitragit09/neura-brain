"use client";

import { suggestedQuestions } from "@/lib/mock/home-data";

type SuggestedQuestionsProps = {
  onSelect?: (question: string) => void;
};

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <section aria-label="Suggested questions" className="space-y-2.5">
      <h3 className="text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
        Suggested searches
      </h3>
      <ul className="flex flex-wrap justify-center gap-2">
        {suggestedQuestions.map((question) => (
          <li key={question}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(question)}
                className="rounded-lg border border-border/10 bg-secondary/35 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all duration-150 cursor-pointer select-none"
              >
                {question}
              </button>
            ) : (
              <span className="inline-block rounded-lg border border-border/10 bg-secondary/35 px-3 py-1.5 text-xs text-muted-foreground select-none">
                {question}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
