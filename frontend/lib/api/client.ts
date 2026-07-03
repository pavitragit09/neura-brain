import type { DocumentItem, SOPItem } from "@/types/knowledge";

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

