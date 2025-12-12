import { fetchApi } from "@/services/api";
import CollectionCard from "@/components/collections/CollectionCard";
import { Library, CircleX } from "lucide-react";
import { CreateCollectionDialog } from "@/components/collections/CreateCollectionDialog";
import { RenderData } from "@/components/RenderData";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import type { RAGCollectionListSchema } from "@/gen/types/RAGCollectionListSchema";

export default function Collections() {
  const {
    data: collections,
    setData: setCollections,
    isLoading,
    error,
    refetch,
  } = useFetch<RAGCollectionListSchema[]>("/rag_collection/list/", "GET");

  const handleCreateCollection = async (
    name: string,
    uploadedFiles: File[]
  ) => {
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
    }
  };

  const handleIndex = async (collectionId: string, fileId: string) => {
    const { data, error } = await fetchApi(
      `/rag_collection/start-indexing/${collectionId}/${fileId}/`,
      "GET"
    );
    if (data) {
      refetch();
    }

    if (error) {
      toast.error(error);
    }
  };

  const handleIndexAll = (collectionId: string) => {
    setCollections(
      (collections ?? []).map((collection) => {
        if ((collection.id?.toString() || "") === collectionId) {
          const allIndexed = (collection.documents ?? []).every(
            (doc) => doc.is_indexed
          );
          return {
            ...collection,
            documents: (collection.documents ?? []).map((doc) => ({
              ...doc,
              is_indexed: !allIndexed,
            })),
          };
        }
        return collection;
      })
    );
  };

  const handleDeleteFile = async (collectionId: string, fileId: string) => {
    const { error } = await fetchApi(
      `/rag_collection/${collectionId}/document/${fileId}/`,
      "DELETE"
    );
    if (!error) {
      refetch();
    } else {
      toast.error(error);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    const { error } = await fetchApi(
      `/rag_collection/${collectionId}/`,
      "DELETE"
    );
    if (!error) {
      refetch();
    } else {
      toast.error(error);
    }
  };

  const handleRenameCollection = async (
    collectionId: string,
    newName: string
  ) => {
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
    }
  };

  const handleAddFilesToCollection = async (
    collectionId: string,
    files: File[]
  ) => {
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
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
          <p className="text-sm text-muted-foreground">
            Manage your RAG knowledge base collections.
          </p>
        </div>
        <CreateCollectionDialog onCreate={handleCreateCollection} />
      </div>

      <div className="flex-grow h-full">
        <RenderData
          data={collections}
          isLoading={isLoading}
          error={error}
          RenderLoading={() => (
            <div className="h-[80%] flex items-center justify-center">
              <div className="loader"></div>
            </div>
          )}
          RenderEmpty={() => (
            <div className="h-[60%] flex flex-col items-center justify-center p-8 text-center shadow-sm">
              <div className="mb-4 text-gray-500 dark:text-gray-400">
                <Library className="w-12 h-12 text-current" />
              </div>

              <div className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                No Collections Found
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
                It looks like you haven't created any collections yet.
              </div>
            </div>
          )}
          RenderError={() => (
            <div className="h-[60%] flex flex-col items-center justify-center p-8 text-center shadow-sm">
              <div className="mb-2 text-gray-500 dark:text-gray-400">
                <CircleX className="w-12 h-12 text-red-900" />
              </div>
              <div className="text-xl font-semibold text-red-900 ">
                OOps! Something went wrong
              </div>
            </div>
          )}
          RenderContent={(collections) => (
            <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  name={collection.rag_collection_name}
                  files={
                    collection.documents?.map((d) => ({
                      id: d.id?.toString() || "",
                      name: d.original_document_name || d.unique_document_name,
                      isIndexed: d.is_indexed || false,
                    })) || []
                  }
                  onIndexFile={(fileId) =>
                    handleIndex(collection.id?.toString() || "", fileId)
                  }
                  onIndexAll={() =>
                    handleIndexAll(collection.id?.toString() || "")
                  }
                  onDeleteFile={(fileId) =>
                    handleDeleteFile(collection.id?.toString() || "", fileId)
                  }
                  onDelete={() =>
                    handleDeleteCollection(collection.id?.toString() || "")
                  }
                  onRename={(newName) =>
                    handleRenameCollection(
                      collection.id?.toString() || "",
                      newName
                    )
                  }
                  onAddFiles={(files) =>
                    handleAddFilesToCollection(
                      collection.id?.toString() || "",
                      files
                    )
                  }
                />
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
}
