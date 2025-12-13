import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Folder } from "lucide-react";
import { CollectionFileItem } from "./CollectionFileItem";
import { CollectionActions } from "./CollectionActions";
import { RenameCollectionDialog } from "./RenameCollectionDialog";
import { AddDocumentDialog } from "./AddDocumentDialog";
import { GenericDeleteConfirmationModal } from "@/common/GenericDeleteConfirmationModal";

interface CollectionFile {
  id: string;
  name: string;
  isIndexed: boolean;
}

interface CollectionCardProps {
  name: string;
  files: CollectionFile[];
  onIndexFile: (fileId: string) => void;
  onIndexAll: () => void;
  onDeleteFile: (fileId: string) => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  onAddFiles: (files: File[]) => void;
}

export default function CollectionCard({
  name,
  files,
  onIndexFile,
  onDeleteFile,
  onRename,
  onDelete,
  onAddFiles,
}: CollectionCardProps) {
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  return (
    <>
      <Card className="flex flex-col gap-0 py-3">
        <CardHeader className="px-2 py-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <div className="p-2 rounded-lg">
                <Folder className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm">{name}</span>
            </CardTitle>
            <CollectionActions
              onEdit={() => setShowRenameModal(true)}
              onAddDocument={() => setShowAddDocModal(true)}
              onDelete={() => setShowDeleteModal(true)}
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1 min-h-[100px]">
          {files.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 py-8 opacity-50">
              <Folder className="h-4 w-4" />
              <p className="text-xs">No documents yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {files.map((file) => (
                <CollectionFileItem
                  key={file.id}
                  file={file}
                  onIndexFile={onIndexFile}
                  onDelete={setFileToDelete}
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
        currentName={name}
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
