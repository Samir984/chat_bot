import React from "react";
import { hasData } from "@/utils/helper";

interface RenderDataProps<T> {
  data: T[] | null;
  isLoading: boolean;
  error: string | null;
  RenderContent: (data: T[]) => React.ReactNode;
  RenderLoading?: () => React.ReactNode;
  RenderEmpty?: () => React.ReactNode;
  RenderError?: () => React.ReactNode;
}

export function RenderData<T>({
  data,
  isLoading,
  error,
  RenderContent,
  RenderLoading,
  RenderEmpty,
  RenderError,
}: RenderDataProps<T>) {
  if (hasData(data)) {
    return <>{RenderContent(data as T[])}</>;
  }
  if (isLoading && !hasData(data)) {
    return (
      RenderLoading?.() || (
        <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      )
    );
  }

  if (error) {
    return (
      RenderError?.() || (
        <div className="h-full flex items-center justify-center text-sm text-rose-500">
          Unable to load data
        </div>
      )
    );
  }

  if (!hasData(data) && !isLoading) {
    return (
      RenderEmpty?.() || (
        <div className="h-full px-2 py-2 text-sm text-muted-foreground">
          No items found
        </div>
      )
    );
  }
}
