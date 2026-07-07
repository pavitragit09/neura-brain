import { NetworkWorkspace } from "@/components/network/network-workspace";
import { Suspense } from "react";

export default function KnowledgeSourcesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground font-mono">Loading networks...</div>}>
      <NetworkWorkspace />
    </Suspense>
  );
}
