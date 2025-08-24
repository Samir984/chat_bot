import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditChatDialog } from "./EditChatDialog";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

interface ChatActionsProps {
  conversationId: string;
  conversationTitle: string;
  onEditTitle: (conversationId: string, newTitle: string) => void;
  onDeleteConversation: (conversationId: string) => void;
}

export function ChatActions({
  conversationId,
  conversationTitle,
  onEditTitle,
  onDeleteConversation,
}: ChatActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this conversation? This action cannot be undone."
      )
    ) {
      onDeleteConversation(conversationId);
    }
  };

  const handleSaveTitle = (newTitle: string) => {
    onEditTitle(conversationId, newTitle);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <MoreHorizontal className="h-3 w-3" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEdit();
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditChatDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentTitle={conversationTitle}
        onSave={handleSaveTitle}
      />
    </>
  );
}
