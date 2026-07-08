export type SearchSource = {
  document: string;
  chunk_index: number;
  excerpt?: string;
  source_type?: string | null;
  google_file_id?: string | null;
  google_web_view_link?: string | null;
};

export type RelatedKnowledgeItem = {
  id: string;
  title: string;
  source: string;
};

export type SearchQueryResponse = {
  answer: string;
  sources: SearchSource[];
  confidence_score: number;
  source_count: number;
  follow_up_questions: string[];
  related_knowledge: RelatedKnowledgeItem[];
};

export type SearchQueryRequest = {
  question: string;
};

export type PipelineStageId = "search" | "evidence" | "verification" | "governance" | "answer";

export type PipelineStageStatus = "pending" | "active" | "complete";

export type PipelineStage = {
  id: PipelineStageId;
  label: string;
  status: PipelineStageStatus;
};

export const PIPELINE_STAGES: Array<{ id: PipelineStageId; label: string }> = [
  { id: "search", label: "Search" },
  { id: "evidence", label: "Evidence" },
  { id: "verification", label: "Verification" },
  { id: "governance", label: "Governance" },
  { id: "answer", label: "Answer" },
];
