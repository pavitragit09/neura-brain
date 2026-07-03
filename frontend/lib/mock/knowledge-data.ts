import type { DocumentItem, SOPItem } from "@/types/knowledge";

export const mockDocuments: DocumentItem[] = [
  {
    id: 1,
    filename: "sample.pdf",
    source_type: "pdf",
    processing_status: "completed",
    sop_id: 4,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
  },
  {
    id: 3,
    filename: "company_brain_test_policy.pdf",
    source_type: "pdf",
    processing_status: "completed",
    sop_id: 6,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
  },
  {
    id: 5,
    filename: "UE24CS342AA3_Internet of Things (CSCS Vertical).pdf",
    source_type: "pdf",
    processing_status: "completed",
    sop_id: 8,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
  },
];

export const mockSOPs: Record<number, SOPItem> = {
  4: {
    id: 4,
    document_name: "sample.pdf",
    structured_sop: `### Standard Operating Procedure: Corporate Travel & Reimbursements

#### 1. Purpose
This procedure defines the guidelines for corporate travel expenses and reimbursement processing.

#### 2. Scope
Applies to all employees traveling on official business.

#### 3. General Rules
- All travel must be pre-approved by the manager.
- Receipts must be provided for all claims over $25.
- Flight bookings should be made at least 14 days in advance where possible.`,
    hallucination_score: 0.05,
    confidence_score: 95.0,
    review_status: "APPROVED",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  6: {
    id: 6,
    document_name: "company_brain_test_policy.pdf",
    structured_sop: `### Standard Operating Procedure: Employee Leave Policy

#### 1. Purpose
Defines leave request workflows, accrual limits, and approval thresholds.

#### 2. Leave Types
- **Annual Leave:** Accrues monthly, requires 2 weeks advance notice.
- **Sick Leave:** Fully paid up to 10 days, doctor's certificate required for >3 consecutive days.`,
    hallucination_score: 0.12,
    confidence_score: 88.0,
    review_status: "HUMAN_REVIEW",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  8: {
    id: 8,
    document_name: "UE24CS342AA3_Internet of Things (CSCS Vertical).pdf",
    structured_sop: `### Technical SOP: Internet of Things (IoT) Lab Setup

#### 1. Equipment Setup
All hardware kits must be inventory checked before deployment.

#### 2. Network Configurations
Configure local IoT devices to connect only to the secure sandboxed vertical Wi-Fi SSID.`,
    hallucination_score: 0.0,
    confidence_score: 91.0,
    review_status: "HUMAN_REVIEW",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
};
