import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { fetchApi } from "@/services/api";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import type { RAGCollectionListSchema } from "@/gen/types/RAGCollectionListSchema";
import type { StartIndexingResponseSchema } from "@/gen/types/StartIndexingResponseSchema";

interface CollectionsContextType {
  collections: RAGCollectionListSchema[] | null;
  isLoading: boolean;
  error: string | null;
  indexingTaskId: string | null;
  createCollection: (name: string, uploadedFiles: File[]) => Promise<void>;
  indexFile: (
    collectionId: string,
    fileId: string
  ) => Promise<string | undefined>;
  indexAll: (collectionId: string) => Promise<string | undefined>;
  deleteFile: (collectionId: string, fileId: string) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  renameCollection: (collectionId: string, newName: string) => Promise<void>;
  addFilesToCollection: (collectionId: string, files: File[]) => Promise<void>;
  refetch: () => void;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(
  undefined
);

interface CollectionsProviderProps {
  children: ReactNode;
}

export function CollectionsProvider({ children }: CollectionsProviderProps) {
  const {
    data: collections,
    isLoading,
    error,
    refetch,
  } = useFetch<RAGCollectionListSchema[]>("/rag_collection/list/", "GET");

  const [indexingTaskId, setIndexingTaskId] = React.useState<string | null>(
    null
  );

  const createCollection = async (name: string, uploadedFiles: File[]) => {
    const formData = new FormData();
    formData.append("rag_collection_name", name);
    uploadedFiles.forEach((file) => formData.append("files", file));

    const { data, error } = await fetchApi<RAGCollectionListSchema>(
      "/rag_collection/",
      "POST",
      formData,
      undefined,
      "form-data"
    );
    if (data) {
      refetch();
    }

    if (error) {
      toast.error(error);
      throw error;
    }
  };

  const indexFile = async (collectionId: string, fileId: string) => {
    const { data, error } = await fetchApi<StartIndexingResponseSchema>(
      `/rag_collection/index-document/${collectionId}/document/${fileId}/`,
      "POST"
    );

    if (data && "task_id" in data) {
      setIndexingTaskId(data.task_id);
      toast.success("Indexing started. Tracking task...");
      return data.task_id;
    }

    if (data && "detail" in data) {
      toast.success((data as { detail: string }).detail);
    }

    if (error) {
      toast.error(error);
    }
  };

  const indexAll = async (collectionId: string) => {
    const { data, error } = await fetchApi<StartIndexingResponseSchema>(
      `/rag_collection/index-all-documents/${collectionId}/`,
      "POST"
    );

    if (data && "task_id" in data) {
      setIndexingTaskId(data.task_id);
      toast.success("Indexing all documents started...");
      return data.task_id;
    }

    if (data && "detail" in data) {
      toast.success((data as { detail: string }).detail);
    }

    if (error) {
      toast.error(error);
    }
  };

  const deleteFile = async (collectionId: string, fileId: string) => {
    const { error } = await fetchApi(
      `/rag_collection/${collectionId}/document/${fileId}/`,
      "DELETE"
    );
    if (!error) {
      refetch();
    } else {
      toast.error(error);
      throw error;
    }
  };

  const deleteCollection = async (collectionId: string) => {
    const { error } = await fetchApi(
      `/rag_collection/${collectionId}/`,
      "DELETE"
    );
    if (!error) {
      refetch();
    } else {
      toast.error(error);
      throw error;
    }
  };

  const renameCollection = async (collectionId: string, newName: string) => {
    const formData = new FormData();
    formData.append("rag_collection_name", newName);
    const { error } = await fetchApi(
      `/rag_collection/${collectionId}/`,
      "PATCH",
      formData,
      undefined,
      "form-data"
    );
    if (!error) {
      refetch();
    } else {
      toast.error(error);
      throw error;
    }
  };

  const addFilesToCollection = async (collectionId: string, files: File[]) => {
    if (files.length === 0) return;

    const formData = new FormData();
    formData.append("rag_collection_name", "");
    files.forEach((file) => formData.append("files", file));

    const { error } = await fetchApi(
      `/rag_collection/${collectionId}/`,
      "PATCH",
      formData,
      undefined,
      "form-data"
    );
    if (!error) {
      refetch();
    } else {
      toast.error(error);
      throw error;
    }
  };

  const value: CollectionsContextType = {
    collections,
    isLoading,
    error,
    indexingTaskId,
    createCollection,
    indexFile,
    indexAll,
    deleteFile,
    deleteCollection,
    renameCollection,
    addFilesToCollection,
    refetch,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCollections() {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return context;
}
