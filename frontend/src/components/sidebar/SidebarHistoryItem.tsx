import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { ConversationListResponseSchema } from "@/gen";
import { SideBarAction } from "./SideBarAction";
interface Props {
  chat: ConversationListResponseSchema;
  onEdit: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
}

export default function SidebarHistoryItem({ chat, onEdit, onDelete }: Props) {
  return (
    <SidebarMenuItem className="flex items-center rounded-lg justify-between hover:text-foreground hover:bg-sidebar-accent/50 transition-all duration-200">
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
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </SidebarMenuItem>
  );
}
