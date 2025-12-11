import type { DataFormat } from "@/types/utils";
export const hasData = <T>(data: T[] | null | undefined): boolean => {
  return Array.isArray(data) && data.length > 0;
};

export const computeHeaders = (dataFormat?: DataFormat): Record<string, string> => {
  return dataFormat === "form-data"
    ? {}
    : {
        "Content-Type": "application/json",
      };
};

export const computeBody = (body?: unknown, dataFormat?: DataFormat): unknown => {
  return dataFormat === "form-data" ? body : JSON.stringify(body);
};
