import type { DataFormat } from "@/types/utils";
export const hasData = <T>(data: T[] | null | undefined): boolean => {
  return Array.isArray(data) && data.length > 0;
};

export const computeHeaders = (
  dataFormat?: DataFormat,
): Record<string, string> => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
  console.log("CSRF Token:", csrfToken);
  return {
    ...(dataFormat === "form-data"
      ? {}
      : { "Content-Type": "application/json" }),
    ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
  };
};

export const computeBody = (
  body?: unknown,
  dataFormat?: DataFormat,
): unknown => {
  return dataFormat === "form-data" ? body : JSON.stringify(body);
};

export const isNotObjectObjectString = (payload: string): boolean => {
  return payload !== "[object Object]";
};
