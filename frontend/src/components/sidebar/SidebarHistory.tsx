import { useEffect } from "react";
import SidebarHistoryItem from "./SidebarHistoryItem";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { RenderData } from "@/components/RenderData";
import type { ConversationListResponseSchema } from "@/gen";
import { useSidebar } from "@/components/ui/sidebar";
import { useFetch } from "@/hooks/useFetch";

export function SidebarHistory() {
  const { sideBarContentRefetch, setSideBarContentRefetch } = useSidebar();

  const {
    data: recentChats,
    isLoading,
    error,
    refetch,
  } = useFetch<ConversationListResponseSchema[]>("/conversation/list/");

  useEffect(() => {
    if (sideBarContentRefetch) {
      refetch();
      setSideBarContentRefetch(false);
    }
  }, [sideBarContentRefetch]);

  return (
    <>
      <SidebarContent className="px-2 flex-1 overflow-y-auto scrollbar-none">
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 px-2 py-2 uppercase tracking-wider">
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              <RenderData
                data={recentChats}
                isLoading={isLoading}
                error={error}
                RenderContent={(data) =>
                  data.map((chat) => (
                    <SidebarHistoryItem
                      key={chat.conversation_id}
                      chat={chat}
                      refetch={refetch}
                    />
                  ))
                }
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
