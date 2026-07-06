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
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
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

export function uploadDocument(
  file: File,
  onProgress: (progress: number) => void,
  signal?: AbortSignal
): Promise<{ message: string; result: Record<string, unknown> }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/upload/`);

    if (signal) {
      signal.addEventListener("abort", () => {
        xhr.abort();
        reject(new DOMException("Aborted", "AbortError"));
      });
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        onProgress(percentage);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText) as { message: string; result: Record<string, unknown> };
          resolve(res);
        } catch {
          reject(new Error("Invalid response format"));
        }
      } else {
        let errorMsg = "Upload failed";
        try {
          const res = JSON.parse(xhr.responseText);
          errorMsg = res.detail ?? errorMsg;
        } catch {}
        reject(new ApiError(errorMsg, xhr.status));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network connection error"));
    };

    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });
}


