import { useEffect, useState, useRef } from "react";
import { Plus, Database, Folder, Search, User, Book } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CollectionSelectorProps {
  selectedCollection: string | null;
  onCollectionSelect: (collectionId: string) => void;
  disabled?: boolean;
}

const COLLECTIONS = [
  {
    id: "project-docs",
    name: "Project Docs",
    icon: Folder,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    id: "research",
    name: "Research Papers",
    icon: Database,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    id: "personal",
    name: "Personal",
    icon: User,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    id: "notes",
    name: "Notes",
    icon: Book,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
];

export default function CollectionSelector({
  selectedCollection,
  onCollectionSelect,
  disabled,
}: CollectionSelectorProps) {
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
    onCollectionSelect(collectionId);
    setSearchQuery("");
    setIsOpen(false);
  };

  const filteredCollections = COLLECTIONS.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCollectionData = COLLECTIONS.find(
    (c) => c.id === selectedCollection
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
              {filteredCollections.length > 0 ? (
                filteredCollections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => handleCollectionSelect(collection.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                  >
                    <div
                      className={`p-1.5 rounded-full ${collection.bgColor} ${collection.color}`}
                    >
                      <collection.icon size={16} />
                    </div>
                    <span className="font-medium">{collection.name}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2.5 text-sm text-muted-foreground text-center">
                  No collections found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedCollection && selectedCollectionData && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border animate-in fade-in slide-in-from-left-2">
          <div
            className={`p-1 rounded-full ${selectedCollectionData.bgColor} ${selectedCollectionData.color}`}
          >
            <selectedCollectionData.icon size={12} />
          </div>
          <span className="text-xs font-medium">
            {selectedCollectionData.name}
          </span>
        </div>
      )}
    </div>
  );
}
