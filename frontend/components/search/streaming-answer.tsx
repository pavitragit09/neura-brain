import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StreamingAnswerProps = {
  question: string;
  answer: string;
  isStreaming: boolean;
  isLoading: boolean;
  timestamp?: string;
};

export function StreamingAnswer({
  question,
  answer,
  isStreaming,
  isLoading,
  timestamp,
}: StreamingAnswerProps) {
  if (isLoading) {
    return (
      <Card aria-label="Answer loading">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Answer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card aria-label="Answer">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Answer</CardTitle>
        {timestamp ? <p className="text-xs text-muted-foreground">{timestamp}</p> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{question}</p>
        <div className="text-sm leading-7 text-foreground whitespace-pre-wrap">
          {answer}
          {isStreaming ? <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground align-middle" /> : null}
        </div>
      </CardContent>
    </Card>
  );
}
