import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, UploadCloud, FileText, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useCollections } from "@/contexts/CollectionsProvider";
import { GenericCreateEditModal } from "@/common/GenericCreateEditModal";
import { useFileUpload } from "@/hooks/useFileUpload";

export function CreateCollectionDialog() {
  const { createCollection } = useCollections();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const {
    fileItems,
    fileInputRef,
    handleFileChange,
    removeFile,
    handleDragOver,
    handleDrop,
    clearFiles,
    openFileDialog,
  } = useFileUpload();

  const files = fileItems.map((item) => item.file);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await createCollection(name, files);
      setName("");
      clearFiles();
      setOpen(false);
    }
  };

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <Plus size={16} /> New Collection
      </Button>

      <GenericCreateEditModal
        open={open}
        onOpenChange={setOpen}
        title="Create Collection"
        description="Add a new collection and upload a PDF document."
        onSubmit={handleCreate}
        submitLabel="Create"
        submitDisabled={!name.trim()}
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Collection Name"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="file" className="text-right mt-2">
              Files
            </Label>
            <div className="col-span-3 space-y-3">
              <div
                className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors border-muted-foreground/25 hover:border-primary/50"
                onClick={openFileDialog}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UploadCloud className="h-8 w-8" />
                  <div className="text-xs">
                    <span className="font-medium text-foreground">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </div>
                  <p className="text-[10px] uppercase">PDF only</p>
                </div>
              </div>

              {fileItems.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {fileItems.map((fileItem) => (
                    <div
                      key={fileItem.id}
                      className="flex items-center gap-2 p-2 rounded-md border bg-muted/40 group relative"
                    >
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {fileItem.file.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {(fileItem.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(fileItem.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </GenericCreateEditModal>
    </>
  );
}
