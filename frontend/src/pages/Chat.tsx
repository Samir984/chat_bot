import { useEffect, useRef, useState } from "react";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import { useAuth } from "@/contexts/AuthProvider";
import { fetchApi } from "@/services/api";
import { toast } from "sonner";
import {
  roleChoicesEnum,
  type ChatResponseSchema,
  type RAGCollectionListSchema,
  type SelectedConversationSchema,
} from "@/gen/types";
import type { Message } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";

import { filterHistoryMessages } from "@/utils/global";
import { useNavigate, useParams } from "react-router-dom";
import { isNotObjectObjectString } from "@/utils/helper";

export default function Chat() {
  const { id } = useParams();
  const { isAuthenticate } = useAuth();
  const [isChatting, setIsChatting] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const conversationAbortControllerRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversation = async () => {
      setIsLoadingChat(true);

      const abortController = new AbortController();
      conversationAbortControllerRef.current = abortController;

      const { data, error } = await fetchApi<SelectedConversationSchema>(
        `/conversation/${id}/`,
        "GET",
        undefined,
        abortController.signal
      );
      if (abortController.signal.aborted) {
        return;
      }
      if (data) {
        setMessages(
          data.history.map((message) => ({
            id: uuidv4(),
            role: message.role,
            content: message.content,
          }))
        );
      }
      if (error) {
        toast.error(
          isNotObjectObjectString(error)
            ? error
            : "Error fetching conversation history"
        );
      }
      setIsLoadingChat(false);
    };
    if (id) {
      fetchConversation();
    } else {
      setMessages([]);
    }
    return () => {
      if (conversationAbortControllerRef.current) {
        conversationAbortControllerRef.current.abort();
        conversationAbortControllerRef.current = null;
      }
    };
  }, [id]);

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
      const aiMsg: Message = {
        id: Date.now().toString(),
        role: "ai",
        content: data.content,
      };
      setMessages((prev) => [...prev, aiMsg]);
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
  const chatHandler = async (
    prompt: string,
    collection: RAGCollectionListSchema | null
  ) => {
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
      {
        conversation_id: id,
        prompt,
        collection_name: collection?.rag_collection_name,
      },
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
      const aiMsg: Message = {
        id: Date.now().toString(),
        role: "ai",
        content: data.content,
      };
      setMessages((prev) => [...prev, aiMsg]);
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

  const handlePromptSubmit = async (
    prompt: string,
    collection: RAGCollectionListSchema | null
  ) => {
    if (prompt.trim().length === 0) {
      return;
    }
    if (isAuthenticate) {
      await chatHandler(prompt, collection);
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
        <MessageList
          messages={messages}
          isLoading={isChatting}
          isLoadingChat={isLoadingChat}
        />
      </div>

      <div className="p-4 sticky bottom-0 left-0 right-0">
        <ChatInput
          onSubmit={(prompt, collection) =>
            handlePromptSubmit(prompt, collection)
          }
          isProcessingPreviousPrompt={isChatting}
          abortCurrentRequest={abortCurrentRequest}
        />
      </div>
    </div>
  );
}
