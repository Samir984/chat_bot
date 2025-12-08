import { useRef, useState } from "react";
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
  interrupted?: boolean;
}

export default function Chat() {
  const { isAuthenticate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handlePromptSubmit = async (text: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    // Optimistically append message and keep ref updated
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const chatEndpoint = isAuthenticate ? "/chat/" : "/chat/public/";

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const history = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const { data, error } = await fetchApi<ChatResponseSchema>(
      chatEndpoint,
      "POST",
      { prompt: text, history },
      abortController.signal
    );

    if (abortController.signal.aborted) {
      const stoppedMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "You stopped the response",
        interrupted: true,
      };
      setIsLoading(false);
      setMessages((prev) => [...prev, stoppedMsg]);
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
      return;
    }

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
    if (abortControllerRef.current === abortController) {
      abortControllerRef.current = null;
    }
  };

  const abortCurrentRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <div className="flex flex-col flex-grow max-h-[calc(100vh-200px)] h-full overflow-y-auto">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      <div className="p-4 sticky bottom-0 left-0 right-0">
        <ChatInput
          onSubmit={handlePromptSubmit}
          isProcessingPreviousPrompt={isLoading}
          abortCurrentRequest={abortCurrentRequest}
        />
      </div>
    </div>
  );
}
