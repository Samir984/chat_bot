import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatActions } from "./ChatActions";
import { Plus, MessageSquare, Settings, Moon, Sun } from "lucide-react";
import type { Conversation } from "@/types/chat";
import useTheme from "@/hooks/useThme";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
  onEditConversationTitle: (conversationId: string, newTitle: string) => void;
  onDeleteConversation: (conversationId: string) => void;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onEditConversationTitle,
  onDeleteConversation,
}: SidebarProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  return (
    <div className="flex h-full w-80 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">
          ChatBot
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="h-8 w-8 p-0"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-3 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="group relative flex items-center"
              >
                <Button
                  variant={
                    currentConversationId === conversation.id
                      ? "secondary"
                      : "ghost"
                  }
                  className="w-full justify-start gap-3 h-auto p-3 text-left pr-10"
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate text-sm">{conversation.title}</span>
                </Button>
                <div className="absolute right-2">
                  <ChatActions
                    conversationId={conversation.id}
                    conversationTitle={conversation.title}
                    onEditTitle={onEditConversationTitle}
                    onDeleteConversation={onDeleteConversation}
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
