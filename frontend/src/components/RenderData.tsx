import React from "react";
import { hasData } from "@/utils/helper";

interface RenderDataProps<T> {
  data: T[] | null;
  isLoading: boolean;
  error: string | null;
  RenderItems: (data: T[]) => React.ReactNode;
}

export function RenderData<T>({
  data,
  isLoading,
  error,
  RenderItems,
}: RenderDataProps<T>) {
  if (isLoading) {
    return (
      <div className="px-2 py-2 text-sm text-muted-foreground">Loading…</div>
    );
  }

  if (error) {
    return (
      <div className="px-2 py-2 text-sm text-rose-500">Unable to load data</div>
    );
  }

  if (!hasData(data) && !isLoading) {
    return (
      <div className="px-2 py-2 text-sm text-muted-foreground">
        No items found
      </div>
    );
  }

  return <>{RenderItems(data as T[])}</>;
}
