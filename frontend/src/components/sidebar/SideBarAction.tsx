import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Edit, Trash } from "lucide-react";

interface SideBarActionProps {
  conversationId: string;
  onEdit: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
}

export function SideBarAction({
  conversationId,
  onEdit,
  onDelete,
}: SideBarActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 mr-2 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => onEdit(conversationId)}
          className="hover:bg-sidebar-accent/50 transition-all duration-200 w-36"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(conversationId)}
          className="hover:bg-sidebar-accent/50 transition-all duration-200 focus:bg-red-950 w-36"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
