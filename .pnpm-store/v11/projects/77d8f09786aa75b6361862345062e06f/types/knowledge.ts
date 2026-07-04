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
