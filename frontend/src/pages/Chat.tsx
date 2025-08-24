import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { getLLMResponse } from "@/services/cheatServices";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  const createNewConversation = (): Conversation => {
    const now = new Date();
    return {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
  };

  const handleNewChat = () => {
    const newConversation = createNewConversation();
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  const handleEditConversationTitle = (
    conversationId: string,
    newTitle: string
  ) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, title: newTitle, updatedAt: new Date() }
          : c
      )
    );
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));

    // If we deleted the current conversation, clear the selection
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  };

  const handleSendMessage = async (content: string) => {
    let conversation = conversations.find(
      (c) => c.id === currentConversationId
    );

    // Create new conversation if none exists
    if (!conversation) {
      conversation = createNewConversation();
      setConversations((prev) => [conversation!, ...prev]);
      setCurrentConversationId(conversation.id);
    }

    // Create user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    // Update conversation with user message
    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, userMessage],
      title:
        conversation.messages.length === 0
          ? content.slice(0, 50) + (content.length > 50 ? "..." : "")
          : conversation.title,
      updatedAt: new Date(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === updatedConversation.id ? updatedConversation : c
      )
    );

    const LLMResponse = await getLLMResponse(content);
    const aiMessage: Message = {
      id: crypto.randomUUID(),
      content: LLMResponse.data.data as string,
      role: "assistant",
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === updatedConversation.id
          ? {
              ...c,
              messages: [...c.messages, aiMessage],
              updatedAt: new Date(),
            }
          : c
      )
    );
  };

  const currentConversation =
    conversations.find((c) => c.id === currentConversationId) || null;

  return (
    <div className="flex h-screen">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onEditConversationTitle={handleEditConversationTitle}
        onDeleteConversation={handleDeleteConversation}
      />
      <div className="flex-1">
        <ChatArea
          conversation={currentConversation}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default Chat;
