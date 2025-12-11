const BASE_URI = import.meta.env.VITE_BACKEND_URI;
import type { DataFormat } from "@/types/utils";
import { computeHeaders, computeBody } from "@/utils/helper";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export const fetchApi = async <T>(
  endpoint: string,
  method: string = "GET",
  body?: unknown,
  signal?: AbortSignal,
  dataFormat?: DataFormat
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${BASE_URI}/api${endpoint}`, {
      headers: computeHeaders(dataFormat),
      method,
      body: computeBody(body, dataFormat) as BodyInit | null,
      credentials: "include",
      signal,
    });

    if (!response.ok) {
      // Attempt to parse error message from server response
      const errorData = await response.json().catch(() => null);

      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        `Error: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.warn("⚠️ Request was aborted.");
    }
    console.error(`❌ Error Occurred!. While fetching ${endpoint}:`, err);
    return { data: null, error: err.message || "An unexpected error occurred" };
  }
};
