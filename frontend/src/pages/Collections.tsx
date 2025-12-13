import { CreateCollectionDialog } from "@/components/collections/CreateCollectionDialog";
import CollectionCard from "@/components/collections/CollectionCard";
import { RenderData } from "@/components/RenderData";
import { Library, CircleX } from "lucide-react";
import { useCollections } from "@/contexts/CollectionsContext";

export default function Collections() {
  const {
    collections,
    isLoading,
    error,
    createCollection,
    indexFile,
    indexAll,
    deleteFile,
    deleteCollection,
    renameCollection,
    addFilesToCollection,
  } = useCollections();

  return (
    <div className="container mx-auto p-6 space-y-8 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
          <p className="text-sm text-muted-foreground">
            Manage your RAG knowledge base collections.
          </p>
        </div>
        <CreateCollectionDialog />
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
              {collections.map((collection) => {
                const collectionId = collection.id?.toString() || "";
                return (
                  <CollectionCard
                    key={collectionId}
                    name={collection.rag_collection_name}
                    files={
                      collection.documents?.map((d) => ({
                        id: d.id?.toString() || "",
                        name:
                          d.original_document_name || d.unique_document_name,
                        isIndexed: d.is_indexed || false,
                      })) || []
                    }
                    onIndexFile={(fileId) => indexFile(collectionId, fileId)}
                    onIndexAll={() => indexAll(collectionId)}
                    onDeleteFile={(fileId) => deleteFile(collectionId, fileId)}
                    onDelete={() => deleteCollection(collectionId)}
                    onRename={(newName) =>
                      renameCollection(collectionId, newName)
                    }
                    onAddFiles={(files) =>
                      addFilesToCollection(collectionId, files)
                    }
                  />
                );
              })}
            </div>
          )}
        />
      </div>
    </div>
  );
}
