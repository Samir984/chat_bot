import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, X } from "lucide-react";
import { GenericCreateEditModal } from "@/common/GenericCreateEditModal";
import { useFileUpload } from "@/hooks/useFileUpload";

interface AddDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (files: File[]) => void;
}

export function AddDocumentDialog({
  open,
  onOpenChange,
  onAdd,
}: AddDocumentDialogProps) {
  const {
    files,
    fileInputRef,
    handleFileChange,
    removeFile,
    handleDragOver,
    handleDrop,
    clearFiles,
    openFileDialog,
  } = useFileUpload();

  const handleSubmit = () => {
    if (files.length > 0) {
      onAdd(files);
      clearFiles();
      onOpenChange(false);
    }
  };

  return (
    <GenericCreateEditModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Documents"
      description="Upload PDF, TXT, or MD files to this collection."
      onSubmit={handleSubmit}
      submitLabel={`Add ${
        files.length > 0 ? `${files.length} Files` : "Documents"
      }`}
      submitDisabled={files.length === 0}
    >
      <div className="grid gap-4">
        <div
          className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-4" />
          <p className="text-sm font-medium">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, TXT, MD up to 10MB
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.txt,.md"
            onChange={handleFileChange}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2 max-h-[150px] overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-md border bg-muted/50"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="h-4 w-4 shrink-0 text-blue-500" />
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  type="button"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </GenericCreateEditModal>
  );
}
