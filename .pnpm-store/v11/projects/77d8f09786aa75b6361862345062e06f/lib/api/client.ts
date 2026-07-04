import type {
  DocumentItem,
  SOPItem,
  TrustSummary,
  AuditLogItem,
  ContradictionsResponse,
  VerificationResponse,
} from "@/types/knowledge";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = "Request failed";

    try {
      const body = (await response.json()) as { detail?: string };
      message = body.detail ?? message;
    } catch {
      message = response.statusText || message;
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export async function getDocuments(): Promise<DocumentItem[]> {
  return apiFetch<DocumentItem[]>("/documents/");
}

export async function getDocumentById(id: number): Promise<DocumentItem> {
  return apiFetch<DocumentItem>(`/documents/${id}`);
}

export async function getDocumentSOP(id: number): Promise<SOPItem> {
  return apiFetch<SOPItem>(`/documents/${id}/sop`);
}

export async function getTrustSummary(): Promise<TrustSummary> {
  return apiFetch<TrustSummary>("/trust/summary");
}

export async function getAuditLogs(): Promise<AuditLogItem[]> {
  return apiFetch<AuditLogItem[]>("/audit/logs");
}

export async function getPendingReviews(): Promise<SOPItem[]> {
  return apiFetch<SOPItem[]>("/review/pending");
}

export async function getSopContradictions(id: number): Promise<ContradictionsResponse> {
  return apiFetch<ContradictionsResponse>(`/sops/${id}/contradictions`);
}

export async function getSopVerification(id: number): Promise<VerificationResponse> {
  return apiFetch<VerificationResponse>(`/sops/${id}/verification`);
}

export async function approveSop(id: number): Promise<{ message: string; sop_id: number; status: string }> {
  return apiFetch<{ message: string; sop_id: number; status: string }>(`/review/${id}/approve`, {
    method: "PATCH",
  });
}

export async function rejectSop(id: number): Promise<{ message: string; sop_id: number; status: string }> {
  return apiFetch<{ message: string; sop_id: number; status: string }>(`/review/${id}/reject`, {
    method: "PATCH",
  });
}


