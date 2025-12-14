import { useState, useEffect, useCallback, useRef } from "react";
import { fetchApi } from "@/services/api";
import { useLocalStorage } from "./useLocalStorage";

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export function useFetch<T>(
  url: string,
  method: string = "GET",
  cacheTime: number = CACHE_TIME
) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    value: data,
    setValue: setData,
    timestamp: dataTimestamp,
  } = useLocalStorage<T | null>(url, null);
  const [error, setError] = useState<string | null>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(0);
  const refetchTriggerRef = useRef<boolean>(false);
  const refetch = useCallback(() => {
    refetchTriggerRef.current = true;
    setTriggerRefetch((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const now = Date.now();
    const shouldFetch =
      refetchTriggerRef.current ||
      data === null ||
      dataTimestamp === null ||
      now - dataTimestamp > cacheTime;

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
      refetchTriggerRef.current = false;
    };

    if (shouldFetch) {
      fetchData();
    }

    return () => {
      abortController.abort();
    };
  }, [url, method, triggerRefetch, setData, data, dataTimestamp, cacheTime]);

  return {
    data,
    setData,
    isLoading,
    error,
    refetch,
  };
}
