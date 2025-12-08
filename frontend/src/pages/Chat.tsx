import { useState } from "react";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import { useAuth } from "@/context/AuthProvider";
import { fetchApi } from "@/services/api";
import { toast } from "sonner";
import type { ChatResponseSchema } from "@/gen/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const { isAuthenticate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let chatEndpoint = "/chat/public";
    if (isAuthenticate) {
      chatEndpoint = "/chat/";
    }

    const { data, error } = await fetchApi<ChatResponseSchema>(
      chatEndpoint,
      "POST",
      JSON.stringify({
        prompt: content,
        history: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      })
    );

    if (data) {
      const assistantMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.content,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }
    if (error) {
      toast.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <div className="flex flex-col flex-grow max-h-[calc(100vh-200px)] h-full overflow-y-auto">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      <div className="p-4 sticky bottom-0 left-0 right-0">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
