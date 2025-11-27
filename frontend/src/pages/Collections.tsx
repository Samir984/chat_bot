import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import CollectionCard from "@/components/CollectionCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Collection {
  id: string;
  name: string;
  docCount: number;
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([
    { id: "1", name: "Project Docs", docCount: 5 },
    { id: "2", name: "Research Papers", docCount: 12 },
  ]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      setCollections([
        ...collections,
        {
          id: Date.now().toString(),
          name: newCollectionName,
          docCount: 0,
        },
      ]);
      setNewCollectionName("");
      setIsCreateOpen(false);
    }
  };

  const handleAddDocument = (collectionId: string) => {
    // Mock adding a document - in real app this would open a file picker or dialog
    setCollections(collections.map(c => 
      c.id === collectionId ? { ...c, docCount: c.docCount + 1 } : c
    ));
    alert(`Mock: Document added to collection ${collectionId}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">
            Manage your RAG knowledge base collections.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} /> New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Collection</DialogTitle>
              <DialogDescription>
                Add a new collection to organize your documents.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCollection}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            name={collection.name}
            docCount={collection.docCount}
            onAddDoc={() => handleAddDocument(collection.id)}
          />
        ))}
      </div>
    </div>
  );
}
