import { useEffect, useRef, useState } from "react";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import { useAuth } from "@/context/AuthProvider";
import { fetchApi } from "@/services/api";
import { toast } from "sonner";
import {
  roleChoicesEnum,
  type ChatResponseSchema,
  type SelectedConversationSchema,
} from "@/gen/types";
import type { Message } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";

import { filterHistoryMessages } from "@/utils/global";
import { useNavigate, useParams } from "react-router-dom";

export default function Chat() {
  const { id } = useParams();
  const { isAuthenticate } = useAuth();
  const [isChatting, setIsChatting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  // `inLoading` is true while the initial conversation (by id) is being fetched
  const [inLoading, setInLoading] = useState(false);

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
    setIsChatting(true);

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

    setIsChatting(false);
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
    setIsChatting(true);

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

    setIsChatting(false);
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
        {inLoading ? (
          <div
            className="flex h-full items-center justify-center"
            role="status"
            aria-live="polite"
            aria-busy={true}
          >
            <div className="flex flex-col items-center gap-3">
              <svg
                className="h-10 w-10 animate-spin text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <div className="text-sm text-muted-foreground">
                Loading conversation…
              </div>
            </div>
          </div>
        ) : (
          <MessageList
            messages={messages}
            isLoading={isChatting || inLoading}
          />
        )}
      </div>

      <div className="p-4 sticky bottom-0 left-0 right-0">
        <ChatInput
          onSubmit={handlePromptSubmit}
          isProcessingPreviousPrompt={isChatting}
          abortCurrentRequest={abortCurrentRequest}
        />
      </div>
    </div>
  );
}
