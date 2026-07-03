import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type EvidenceStripProps = {
  sourceCount: number;
  confidenceScore: number;
  reviewStatus?: string;
  lastReviewed?: string;
  department?: string;
  isLoading?: boolean;
};

export function EvidenceStrip({
  sourceCount,
  confidenceScore,
  reviewStatus = "Latest approved version",
  lastReviewed = "Recently verified",
  department,
  isLoading = false,
}: EvidenceStripProps) {
  if (isLoading) {
    return (
      <Card aria-label="Evidence summary loading">
        <CardContent className="grid gap-2 p-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-4 animate-pulse rounded bg-muted" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const confidencePercent = Math.round(confidenceScore * 100);

  return (
    <Card aria-label="Evidence summary">
      <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
        <EvidenceItem label={`${sourceCount} sources verified`} />
        <EvidenceItem label={reviewStatus} />
        <EvidenceItem label={`Confidence ${confidencePercent}%`} />
        <EvidenceItem label={`Reviewed ${lastReviewed}`} />
        {department ? <EvidenceItem label={department} className="sm:col-span-2" /> : null}
      </CardContent>
    </Card>
  );
}

type EvidenceItemProps = {
  label: string;
  className?: string;
};

function EvidenceItem({ label, className }: EvidenceItemProps) {
  return (
    <div className={`flex items-center gap-2 text-sm ${className ?? ""}`}>
      <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
