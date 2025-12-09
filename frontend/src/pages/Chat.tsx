import { useEffect, useRef, useState } from "react";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import { useAuth } from "@/context/AuthProvider";
import { fetchApi } from "@/services/api";
import { toast } from "sonner";
import { roleChoicesEnum, type ChatResponseSchema } from "@/gen/types";
import type { Message } from "@/types/chat";
import { filterHistoryMessages } from "@/utils/global";
import { useNavigate, useParams } from "react-router-dom";

export default function Chat() {
  const { isAuthenticate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const abortControllerRef = useRef<AbortController | null>(null);

  // for unauthenticated users
  const publicChatHandler = async (prompt: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: roleChoicesEnum.user,
      content: prompt,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const { data, error } = await fetchApi<ChatResponseSchema>(
      "/chat/public/",
      "POST",
      { prompt, history: filterHistoryMessages(messages) },
      abortController.signal
    );

    if (abortController.signal.aborted) {
      const stoppedMsg: Message = {
        id: Date.now().toString(),
        role: roleChoicesEnum.ai,
        content: "You stopped the response",
        type: "INTERRUPTED",
      };

      setMessages((prev) => [...prev, stoppedMsg]);
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }

    if (data) {
      const assistantMsg: Message = {
        id: Date.now().toString(),
        role: "ai",
        content: data.content,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }

    if (error && !abortController.signal.aborted) {
      toast.error(error.slice(0, 100).split(".")[0]);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "ai",
        content: `Error: ${error.slice(0, 100).split(".")[0]}`,
        type: "ERROR",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setIsLoading(false);
    if (abortControllerRef.current === abortController) {
      abortControllerRef.current = null;
    }
  };

  // for authenticated users
  const chatHandler = async (prompt: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: roleChoicesEnum.user,
      content: prompt,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const { data, error } = await fetchApi<ChatResponseSchema>(
      "/chat/",
      "POST",
      { conversation_id: id, prompt },
      abortController.signal
    );

    if (abortController.signal.aborted) {
      const stoppedMsg: Message = {
        id: Date.now().toString(),
        role: roleChoicesEnum.ai,
        content: "You stopped the response",
        type: "INTERRUPTED",
      };

      setMessages((prev) => [...prev, stoppedMsg]);
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }

    if (data) {
      const assistantMsg: Message = {
        id: Date.now().toString(),
        role: "ai",
        content: data.content,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      navigate(`/conversation/${data.conversation_id}`);
    }

    if (error && !abortController.signal.aborted) {
      toast.error(error.slice(0, 100).split(".")[0]);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "ai",
        content: `Error: ${error.slice(0, 100).split(".")[0]}`,
        type: "ERROR",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setIsLoading(false);
    if (abortControllerRef.current === abortController) {
      abortControllerRef.current = null;
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    if (prompt.trim().length === 0) {
      return;
    }
    if (isAuthenticate) {
      await chatHandler(prompt);
    } else {
      await publicChatHandler(prompt);
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
