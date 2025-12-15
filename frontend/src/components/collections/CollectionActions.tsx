import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Edit, Trash, Plus, Zap } from "lucide-react";

interface CollectionActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onAddDocument?: () => void;
  onIndexAll?: () => void;
}

export function CollectionActions({
  onEdit,
  onDelete,
  onAddDocument,
  onIndexAll,
}: CollectionActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onAddDocument}>
          <Plus className="mr-2 h-4 w-4" />
          Add Document
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onIndexAll}>
          <Zap className="mr-2 h-4 w-4" />
          Index All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="focus:bg-red-950">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
