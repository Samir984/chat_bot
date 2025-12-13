import { useEffect, useState, useRef } from "react";
import { Plus, Folder, Search, CheckCircle2, Ban } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFetch } from "@/hooks/useFetch";
import type { RAGCollectionListSchema } from "@/gen/types/RAGCollectionListSchema";
import { useCollections } from "@/contexts/CollectionsContext";

interface CollectionSelectorProps {
  selectedCollection: RAGCollectionListSchema | null;
  onCollectionSelect: (collection: RAGCollectionListSchema) => void;
  disabled?: boolean;
}

export default function CollectionSelector({
  selectedCollection,
  onCollectionSelect,
  disabled,
}: CollectionSelectorProps) {
  const { collections } = useCollections();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      inputRef.current?.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCollectionSelect = (collectionId: string) => {
    const collection = collections?.find(
      (c) => (c.id?.toString() || "") === collectionId
    );

    const hasIndexedDocs = collection?.documents?.some((d) => d.is_indexed);
    if (collection && hasIndexedDocs) {
      onCollectionSelect(collection);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const filteredCollections = collections?.filter((collection) =>
    collection.rag_collection_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex items-center gap-2" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors text-sm font-medium",
          isOpen ? "bg-accent text-accent-foreground" : "hover:bg-accent",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Plus size={16} />
        <span>Collection</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-popover text-popover-foreground rounded-md border shadow-md z-50 animate-in fade-in-0 zoom-in-95">
          <div className="p-2">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              Select RAG Collection
            </div>
            <div className="h-px bg-border my-1" />

            <div className="px-2 py-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8"
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto py-1">
              {filteredCollections && filteredCollections.length > 0 ? (
                filteredCollections.map((collection) => {
                  const hasIndexedDocs = collection.documents?.some(
                    (d) => d.is_indexed
                  );
                  const isDisabled = !hasIndexedDocs;
                  return (
                    <button
                      key={collection.id?.toString() || ""}
                      onClick={() =>
                        handleCollectionSelect(collection.id?.toString() || "")
                      }
                      disabled={isDisabled}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm transition-colors text-left",
                        isDisabled
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center h-6 w-6 rounded-full",
                          hasIndexedDocs
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {hasIndexedDocs ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Ban className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {collection.rag_collection_name}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-2.5 text-sm text-muted-foreground text-center">
                  No collections found
                </div>
              )}
            </div>
            <div className="px-2 py-1 text-xs text-muted-foreground">
              Only collections with indexed documents can be selected.
            </div>
          </div>
        </div>
      )}

      {selectedCollection && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border animate-in fade-in slide-in-from-left-2">
          <div className="p-1 rounded-full bg-primary/10 text-primary">
            <Folder size={12} />
          </div>
          <span className="text-xs font-medium">
            {selectedCollection.rag_collection_name}
          </span>
        </div>
      )}
    </div>
  );
}
