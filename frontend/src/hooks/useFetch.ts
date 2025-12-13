import { useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/services/api";

export function useFetch<T>(url: string, method: string = "GET") {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(0);
  const refetch = useCallback(() => {
    setTriggerRefetch((prev) => prev + 1);
  }, []);

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
  }, [url, method, triggerRefetch]);

  return { data, setData, isLoading, error, refetch };
}
