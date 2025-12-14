import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { ConversationListResponseSchema } from "@/gen";
import { SideBarAction } from "./SideBarAction";
import { GenericDeleteConfirmationModal } from "@/common/GenericDeleteConfirmationModal";
import { EditHistoryModel } from "./EditHistoryModel";
import { fetchApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  chat: ConversationListResponseSchema;
  refetch: () => void;
}

export default function SidebarHistoryItem({ chat, refetch }: Props) {
  const navigate = useNavigate();
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false);
  const [showDeleteHistoryModal, setShowDeleteHistoryModal] = useState(false);

  const handleDeleteHistory = async (conversationId: string) => {
    const { error } = await fetchApi(
      `/conversation/${conversationId}/`,
      "DELETE"
    );
    if (!error) {
      refetch();
      navigate(`/`);
    }
    setShowDeleteHistoryModal(false);
  };

  const handleEditHistory = async (
    conversation: ConversationListResponseSchema
  ) => {
    const { error } = await fetchApi(
      `/conversation/${conversation.conversation_id}/?conversation_title=${conversation.conversation_title}`,
      "PATCH"
    );
    if (!error) {
      refetch();
    } else {
      toast.error(error);
      throw error;
    }
    setShowEditHistoryModal(false);
  };
  return (
    <>
      <SidebarMenuItem className="flex items-center rounded-lg  justify-between hover:text-foreground hover:bg-sidebar-accent/50 transition-all duration-200">
        <SidebarMenuButton asChild className="h-8 px-2 hover:bg-transparent">
          <Link
            to={`conversation/${chat.conversation_id}`}
            className="flex items-center gap-2.5"
          >
            <MessageSquare
              size={14}
              className="min-w-3.5 text-muted-foreground/70 transition-colors"
            />
            <span className="truncate text-sm">{chat.conversation_title}</span>
          </Link>
        </SidebarMenuButton>
        <SideBarAction
          conversationId={chat.conversation_id}
          onEdit={() => setShowEditHistoryModal(true)}
          onDelete={() => setShowDeleteHistoryModal(true)}
        />
      </SidebarMenuItem>
      <GenericDeleteConfirmationModal
        open={showDeleteHistoryModal}
        onOpenChange={setShowDeleteHistoryModal}
        onConfirm={() => handleDeleteHistory(chat.conversation_id)}
        title="Delete Conversation History"
        description="Are you sure you want to delete this Conversation History?."
      />
      <EditHistoryModel
        open={showEditHistoryModal}
        onOpenChange={setShowEditHistoryModal}
        conversation={chat}
        onEdit={handleEditHistory}
      />
    </>
  );
}
