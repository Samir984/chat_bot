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
  dataFormat?: DataFormat,
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

export const streamApi = async (
  endpoint: string,
  callbacks: {
    onNext: (data: any) => void;
    onError: (error: string) => void;
    onFinish?: () => void;
    onStart?: (data?: any) => void;
  },
  options: {
    method?: string;
    body?: unknown;
    signal?: AbortSignal;
    dataFormat?: DataFormat;
  } = {},
): Promise<void> => {
  const { method = "GET", body, signal, dataFormat } = options;

  try {
    const response = await fetch(`${BASE_URI}/api${endpoint}`, {
      headers: computeHeaders(dataFormat),
      method,
      body: computeBody(body, dataFormat) as BodyInit | null,
      credentials: "include",
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `Error: ${response.statusText}`);
    }

    if (!response.body) throw new Error("ReadableStream not supported.");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let isFirstData = true;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine.startsWith("data: ")) continue;

        const dataStr = trimmedLine.replace("data: ", "");
        try {
          const data = JSON.parse(dataStr);

          // Call onStart with the first data chunk
          if (isFirstData) {
            callbacks.onStart?.(data);
            isFirstData = false;
          }

          // Call onNext for all data chunks (including the first one)
          callbacks.onNext(data);
        } catch (e) {
          console.error("Error parsing SSE data:", e);
        }
      }
    }
    callbacks.onFinish?.();
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.warn("⚠️ Request was aborted.");
    }
    console.error(`❌ Error Occurred!. While fetching ${endpoint}:`, err);
    callbacks.onError(err.message || "An unexpected error occurred");
  }
};
