import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Folder } from "lucide-react";
import { CollectionFileItem } from "./CollectionFileItem";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { CollectionActions } from "./CollectionActions";
import { RenameCollectionDialog } from "./RenameCollectionDialog";
import { AddDocumentDialog } from "./AddDocumentDialog";

interface CollectionFile {
  id: string;
  name: string;
  isIndexed: boolean;
}

interface CollectionCardProps {
  name: string;
  files: CollectionFile[];
  onToggleIndex: (fileId: string) => void;
  onIndexAll: () => void;
  onDeleteFile: (fileId: string) => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  onAddFiles: (files: File[]) => void;
}

export default function CollectionCard({
  name,
  files,
  onToggleIndex,
  onDeleteFile,
  onRename,
  onDelete,
  onAddFiles,
}: CollectionCardProps) {
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [showRename, setShowRename] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const confirmDeleteFile = () => {
    if (fileToDelete) {
      onDeleteFile(fileToDelete);
      setFileToDelete(null);
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
              onEdit={() => setShowRename(true)}
              onAddDocument={() => setShowAddDoc(true)}
              onDelete={() => setShowDelete(true)}
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
                  onToggleIndex={onToggleIndex}
                  onDelete={setFileToDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={!!fileToDelete}
        onOpenChange={(open) => !open && setFileToDelete(null)}
        onConfirm={confirmDeleteFile}
        title="Delete File"
        description="Are you sure you want to delete this file? This action cannot be undone."
      />

      <DeleteConfirmationDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={() => {
          onDelete();
          setShowDelete(false);
        }}
        title="Delete Collection"
        description={`Are you sure you want to delete the collection "${name}"? This will also delete all files within it.`}
      />

      <RenameCollectionDialog
        open={showRename}
        onOpenChange={setShowRename}
        currentName={name}
        onRename={onRename}
      />

      <AddDocumentDialog
        open={showAddDoc}
        onOpenChange={setShowAddDoc}
        onAdd={onAddFiles}
      />
    </>
  );
}
