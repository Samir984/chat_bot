import { GenericCreateEditModal } from "@/common/GenericCreateEditModal";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import type { ConversationListResponseSchema } from "@/gen";

interface EditHistoryModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: ConversationListResponseSchema;
  onEdit: (conversation: ConversationListResponseSchema) => void;
}

export function EditHistoryModel({
  open,
  onOpenChange,
  conversation,
  onEdit,
}: EditHistoryModelProps) {
  const [conversationTitle, setConversationTitle] = useState("");

  useEffect(() => {
    if (open) {
      setConversationTitle(conversation.conversation_title);
    }
  }, [open, conversation.conversation_title]);

  return (
    <GenericCreateEditModal
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={() =>
        onEdit({ ...conversation, conversation_title: conversationTitle })
      }
      title="Rename Conversation"
      description="Enter a new name for your conversation."
    >
      <div className="grid gap-2">
        <Label htmlFor="conversationTitle">Conversation Title</Label>
        <Input
          id="conversationTitle"
          value={conversationTitle}
          onChange={(e) => setConversationTitle(e.target.value)}
        />
      </div>
    </GenericCreateEditModal>
  );
}
