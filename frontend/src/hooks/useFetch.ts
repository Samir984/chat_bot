import { useState, useEffect } from "react";
import { fetchApi } from "@/services/api";

export function useFetch<T>(url: string, method: string = "GET") {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await fetchApi<T>(
        url,
        method,
        undefined,
        abortController.signal
      );

      if (data) {
        setData(data);
      }

      if (error && !abortController.signal.aborted) {
        setError(error);
      }
      setIsLoading(false);
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url, method]);

  return { data, setData, isLoading, error };
}
