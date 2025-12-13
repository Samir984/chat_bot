import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GenericCreateEditModal } from "@/common/GenericCreateEditModal";

interface RenameCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onRename: (newName: string) => void;
}

export function RenameCollectionDialog({
  open,
  onOpenChange,
  currentName,
  onRename,
}: RenameCollectionDialogProps) {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (open) {
      setName(currentName);
    }
  }, [open, currentName]);

  const handleSubmit = () => {
    if (name.trim()) {
      onRename(name.trim());
      onOpenChange(false);
    }
  };

  return (
    <GenericCreateEditModal
      open={open}
      onOpenChange={onOpenChange}
      title="Rename Collection"
      description="Enter a new name for your collection."
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Collection Name"
          autoFocus
        />
      </div>
    </GenericCreateEditModal>
  );
}
