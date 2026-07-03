import { apiFetch } from "@/lib/api/client";
import type { SearchQueryRequest, SearchQueryResponse } from "@/types/search";

export async function submitSearchQuery(payload: SearchQueryRequest): Promise<SearchQueryResponse> {
  return apiFetch<SearchQueryResponse>("/query/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
