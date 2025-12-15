import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Folder, X } from "lucide-react";
import { fetchApi } from "@/services/api";
import { CollectionFileItem } from "./CollectionFileItem";
import { CollectionActions } from "./CollectionActions";
import { RenameCollectionDialog } from "./RenameCollectionDialog";
import { AddDocumentDialog } from "./AddDocumentDialog";
import { GenericDeleteConfirmationModal } from "@/common/GenericDeleteConfirmationModal";
import type { RAGCollectionListSchema } from "@/gen/types/RAGCollectionListSchema";
import type { IndexingStatusResponseSchema } from "@/gen/types/IndexingStatusResponseSchema";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { isNotObjectObjectString } from "@/utils/helper";
import { toast } from "sonner";

interface CollectionCardProps {
  collection: RAGCollectionListSchema;
  onIndexFile: (fileId: string) => Promise<string | undefined>;
  onIndexAll: () => Promise<string | undefined>;
  onDeleteFile: (fileId: string) => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  onAddFiles: (files: File[]) => void;
  refetch: () => void;
}
interface TaskId {
  collectionId: string | null;
  fileId: string | null;
  taskId: string | null;
}

export default function CollectionCard({
  collection,
  onIndexFile,
  onIndexAll,
  onDeleteFile,
  onRename,
  onDelete,
  onAddFiles,
  refetch,
}: CollectionCardProps) {
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskId, setTaskId] = useState<TaskId>({
    collectionId: null,
    fileId: null,
    taskId: null,
  });
  const [indexingStatus, setIndexingStatus] =
    useState<IndexingStatusResponseSchema | null>(null);

  const confirmDeleteFile = () => {
    if (fileToDelete) {
      onDeleteFile(fileToDelete);
      setFileToDelete(null);
    }
  };
  const confirmDeleteCollection = () => {
    if (showDeleteModal) {
      onDelete();
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const startPolling = async () => {
      interval = setInterval(async () => {
        let url = `/rag_collection/indexing-status/${taskId.taskId}/`;
        if (taskId.fileId) {
          url += `?document_id=${taskId.fileId}`;
        }
        const { data, error } = await fetchApi<IndexingStatusResponseSchema>(
          url,
          "GET"
        );
        if (data) {
          setIndexingStatus(data);
          if (data.status === "SUCCESS" || data.status === "FAILURE") {
            clearInterval(interval);
            setTimeout(() => {
              setIndexingStatus(null);
              setTaskId({
                collectionId: null,
                fileId: null,
                taskId: null,
              });
            }, 1000);
          }
          if (data.status === "SUCCESS") {
            refetch();
          }
          if (data.status === "FAILURE") {
            toast.error(data?.message?.split(".")[0]);
          }
        }
        if (error) {
          toast.error(
            isNotObjectObjectString(error) || "Error fetching indexing status"
          );
          clearInterval(interval);
          setIndexingStatus(null);
        }
      }, 1000);
    };
    if (taskId.taskId) {
      startPolling();
    }
    return () => {
      clearInterval(interval);
    };
  }, [taskId]);

  const handleIndexFile = async (fileId: string) => {
    // show indexing status
    setIndexingStatus({
      status: "PENDING",
      progress: 0,
      message: "Indexing in progress...",
    });
    const taskId = await onIndexFile(fileId);
    if (taskId) {
      setTaskId({
        collectionId: collection.id?.toString() || null,
        fileId: fileId,
        taskId: taskId,
      });
    } else {
      setIndexingStatus(null);
    }
  };

  const handleIndexAll = async () => {
    const taskId = await onIndexAll();
    if (taskId) {
      setTaskId({
        collectionId: collection.id?.toString() || null,
        fileId: null,
        taskId: taskId,
      });
      setIndexingStatus(null);
    }
  };

  return (
    <>
      <Card className="flex flex-col gap-0 py-3">
        <CardHeader className="px-2 py-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className="p-2 rounded-lg">
                <Folder className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm">{collection.rag_collection_name}</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              {indexingStatus && indexingStatus?.status !== "FAILURE" && (
                <div className="w-5 h-5">
                  <CircularProgressbar
                    value={indexingStatus?.progress || 0}
                    background
                    backgroundPadding={6}
                    styles={buildStyles({
                      backgroundColor: "#3e98c7",
                      textColor: "#fff",
                      pathColor: "#fff",
                      trailColor: "transparent",
                    })}
                  />
                </div>
              )}
              {indexingStatus?.status === "FAILURE" && (
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <X className="h-4 w-4 text-white" />
                </div>
              )}
              <CollectionActions
                onEdit={() => setShowRenameModal(true)}
                onAddDocument={() => setShowAddDocModal(true)}
                onDelete={() => setShowDeleteModal(true)}
                onIndexAll={handleIndexAll}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 min-h-[100px]">
          {collection.documents?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 py-8 opacity-50">
              <Folder className="h-4 w-4" />
              <p className="text-xs">No documents yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {collection.documents?.map((file) => (
                <CollectionFileItem
                  key={file.id}
                  file={file}
                  onIndexFile={handleIndexFile}
                  onDelete={setFileToDelete}
                  indexingStatus={
                    taskId.fileId === file.id?.toString() ||
                    (taskId.fileId === null && taskId.taskId !== null)
                      ? indexingStatus
                      : null
                  }
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <GenericDeleteConfirmationModal
        open={!!fileToDelete}
        onOpenChange={(open) => !open && setFileToDelete(null)}
        onConfirm={confirmDeleteFile}
        title="Delete File"
        description="Are you sure you want to delete this file? This action cannot be undone."
      />
      <GenericDeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={confirmDeleteCollection}
        title="Delete Collection"
        description={`Are you sure you want to delete the collection "${name}"? This will also delete all files within it.`}
      />

      <RenameCollectionDialog
        open={showRenameModal}
        onOpenChange={setShowRenameModal}
        currentName={collection.rag_collection_name}
        onRename={onRename}
      />

      <AddDocumentDialog
        open={showAddDocModal}
        onOpenChange={setShowAddDocModal}
        onAdd={onAddFiles}
      />
    </>
  );
}
