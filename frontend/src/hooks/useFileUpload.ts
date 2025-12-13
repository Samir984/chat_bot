import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

interface FileWithId {
  id: string;
  file: File;
}

export function useFileUpload() {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files).map((file) => ({
          id: uuidv4(),
          file,
        }));
        setFiles((prev) => [...prev, ...newFiles]);
      }
    },
    []
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((fileItem) => fileItem.id !== id));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        id: uuidv4(),
        file,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileItems: files,
    fileInputRef,
    handleFileChange,
    removeFile,
    handleDragOver,
    handleDrop,
    clearFiles,
    openFileDialog,
  };
}
