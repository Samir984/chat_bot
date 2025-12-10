import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { ConversationListResponseSchema } from "@/gen";

interface Props {
  chat: ConversationListResponseSchema;
}

export default function SidebarHistoryItem({ chat }: Props) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
      >
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
    </SidebarMenuItem>
  );
}
