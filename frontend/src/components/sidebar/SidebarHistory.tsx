import SidebarHistoryItem from "./SidebarHistoryItem";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import type { ConversationListResponseSchema } from "@/gen";
import { useFetch } from "@/hooks/useFetch";

export function SidebarHistory() {
  const {
    data: recentChats,
    setData: setRecentChats,
    isLoading,
    error,
  } = useFetch<ConversationListResponseSchema[]>("/conversation/list/");

  console.log("isloading", isLoading);
  const recent = recentChats ?? [];

  return (
    <SidebarContent className="px-2 flex-1 overflow-y-auto scrollbar-none">
      <SidebarGroup className="mt-4">
        <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 px-2 py-2 uppercase tracking-wider">
          Recent
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-0.5">
            {isLoading ? (
              <div className="px-2 py-2 text-sm text-muted-foreground">
                Loading…
              </div>
            ) : error ? (
              <div className="px-2 py-2 text-sm text-rose-500">
                Unable to load recent conversations
              </div>
            ) : recent.length === 0 ? (
              <div className="px-2 py-2 text-sm text-muted-foreground">
                No recent conversations
              </div>
            ) : (
              recent.map((chat) => (
                <SidebarHistoryItem key={chat.conversation_id} chat={chat} />
              ))
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
