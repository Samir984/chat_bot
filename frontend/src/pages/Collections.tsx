import { useState } from "react";
import CollectionCard from "@/components/collections/CollectionCard";
import { CreateCollectionDialog } from "@/components/collections/CreateCollectionDialog";

interface CollectionFile {
  id: string;
  name: string;
  isIndexed: boolean;
}

interface Collection {
  id: string;
  name: string;
  files: CollectionFile[];
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "1",
      name: "Project Docs",
      files: [
        { id: "f1", name: "requirements.pdf", isIndexed: true },
        { id: "f2", name: "architecture.pdf", isIndexed: false },
      ],
    },
    {
      id: "2",
      name: "Research Papers",
      files: [
        { id: "f3", name: "attention_is_all_you_need.pdf", isIndexed: true },
      ],
    },
  ]);

  const handleCreateCollection = (name: string, uploadedFiles: File[]) => {
    const newFiles: CollectionFile[] = uploadedFiles.map((f) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      isIndexed: false,
    }));

    setCollections([
      ...collections,
      {
        id: Date.now().toString(),
        name: name,
        files: newFiles,
      },
    ]);
  };

  const handleToggleIndex = (collectionId: string, fileId: string) => {
    setCollections(
      collections.map((c) => {
        if (c.id === collectionId) {
          return {
            ...c,
            files: c.files.map((f) =>
              f.id === fileId ? { ...f, isIndexed: !f.isIndexed } : f
            ),
          };
        }
        return c;
      })
    );
  };

  const handleIndexAll = (collectionId: string) => {
    setCollections(
      collections.map((c) => {
        if (c.id === collectionId) {
          const allIndexed = c.files.every((f) => f.isIndexed);
          return {
            ...c,
            files: c.files.map((f) => ({ ...f, isIndexed: !allIndexed })),
          };
        }
        return c;
      })
    );
  };

  const handleDeleteFile = (collectionId: string, fileId: string) => {
    setCollections(
      collections.map((c) => {
        if (c.id === collectionId) {
          return {
            ...c,
            files: c.files.filter((f) => f.id !== fileId),
          };
        }
        return c;
      })
    );
  };

  const handleDeleteCollection = (collectionId: string) => {
    setCollections(collections.filter((c) => c.id !== collectionId));
  };

  const handleRenameCollection = (collectionId: string, newName: string) => {
    setCollections(
      collections.map((c) =>
        c.id === collectionId ? { ...c, name: newName } : c
      )
    );
  };

  const handleAddFilesToCollection = (collectionId: string, files: File[]) => {
    const newFiles: CollectionFile[] = files.map((f) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      isIndexed: false,
    }));

    setCollections(
      collections.map((c) =>
        c.id === collectionId ? { ...c, files: [...c.files, ...newFiles] } : c
      )
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
          <p className="text-sm text-muted-foreground">
            Manage your RAG knowledge base collections.
          </p>
        </div>
        <CreateCollectionDialog onCreate={handleCreateCollection} />
      </div>

      <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            name={collection.name}
            files={collection.files}
            onToggleIndex={(fileId) => handleToggleIndex(collection.id, fileId)}
            onIndexAll={() => handleIndexAll(collection.id)}
            onDeleteFile={(fileId) => handleDeleteFile(collection.id, fileId)}
            onDelete={() => handleDeleteCollection(collection.id)}
            onRename={(newName) =>
              handleRenameCollection(collection.id, newName)
            }
            onAddFiles={(files) =>
              handleAddFilesToCollection(collection.id, files)
            }
          />
        ))}
      </div>
    </div>
  );
}
