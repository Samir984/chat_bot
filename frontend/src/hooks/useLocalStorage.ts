import { useEffect, useState } from "react";

interface CachedData<T> {
  data: T;
  timestamp: number;
}
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedData, setStoredData] = useState<{
    data: T;
    timestamp: number | null;
  }>(() => {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed: CachedData<T> = JSON.parse(item);
      if (parsed.data === null) {
        return { data: initialValue, timestamp: null };
      }
      return {
        data: parsed.data,
        timestamp: parsed.timestamp || null,
      };
    }
    return { data: initialValue, timestamp: null };
  });

  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify({
        data: storedData.data,
        timestamp: storedData.timestamp,
      })
    );
  }, [key, storedData]);

  const setValue = (value: T | ((val: T) => T)) => {
    setStoredData((prev) => {
      const valueToStore = value instanceof Function ? value(prev.data) : value;
      return {
        data: valueToStore,
        timestamp: Date.now(),
      };
    });
  };

  return { value: storedData.data, setValue, timestamp: storedData.timestamp };
}
