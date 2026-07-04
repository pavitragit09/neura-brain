export type ProcessingStatus = "pending" | "processing" | "completed" | "failed";
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "AUTO_PUBLISH" | "HUMAN_REVIEW";

export interface DocumentItem {
  id: number;
  filename: string;
  source_type: string;
  processing_status: ProcessingStatus;
  sop_id: number;
  created_at: string;
}

export interface SOPItem {
  id: number;
  document_name: string;
  structured_sop: string;
  hallucination_score: number;
  confidence_score: number;
  review_status: ReviewStatus;
  created_at: string;
}

export type ConnectorCategory = "documents" | "collaboration" | "knowledge" | "engineering";
export type ConnectorStatusType = "connected" | "syncing" | "needs_attention" | "coming_soon";

export interface ConnectorItem {
  id: string;
  name: string;
  category: ConnectorCategory;
  status: ConnectorStatusType;
  description: string;
  icon: string;
  lastSync?: string;
  assetsCount?: number;
  chunksCount?: number;
}

export interface TrustSummary {
  verified_assets_count: number;
  pending_review_count: number;
  failed_ingestion_count: number;
  average_confidence: number;
  audit_chain_valid: boolean;
  knowledge_assets: number;
}

export interface AuditLogItem {
  id: number;
  action: string;
  entity_type: string;
  entity_id: number | null;
  performed_by: string;
  details: string | null;
  previous_hash: string | null;
  current_hash: string | null;
  created_at: string;
}

export interface ContradictionItem {
  id: string;
  source_passage: string;
  target_passage: string;
  description: string;
  severity: "high" | "medium" | "low";
}

export interface ContradictionsResponse {
  sop_id: number;
  document_name: string;
  status: string;
  contradictions: ContradictionItem[];
}

export interface VerificationStageItem {
  stage_id: string;
  label: string;
  status: "pending" | "active" | "completed" | "failed";
  details: string | null;
}

export interface VerificationResponse {
  sop_id: number;
  overall_status: "completed" | "pending" | "failed";
  stages: VerificationStageItem[];
}
