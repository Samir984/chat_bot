import { useEffect, useRef, useState } from "react";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import { useAuth } from "@/contexts/AuthProvider";
import { fetchApi, streamApi } from "@/services/api";
import { toast } from "sonner";
import {
  roleChoicesEnum,
  type RAGCollectionListSchema,
  type SelectedConversationSchema,
} from "@/gen/types";
import type { Message } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";

import { filterHistoryMessages } from "@/utils/global";
import { useNavigate, useParams } from "react-router-dom";
import { isNotObjectObjectString } from "@/utils/helper";
import { useSidebar } from "@/components/ui/sidebar";

export default function Chat() {
  const { id } = useParams();
  const [preventRefetch, setPreventRefetch] = useState(false);
  const { setSideBarContentRefetch } = useSidebar();
  const { isAuthenticate } = useAuth();
  const [isChatting, setIsChatting] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const conversationAbortControllerRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversation = async () => {
      if (preventRefetch) {
        setPreventRefetch(false);
        return;
      }
      setIsLoadingChat(true);

      const abortController = new AbortController();
      conversationAbortControllerRef.current = abortController;

      const { data, error } = await fetchApi<SelectedConversationSchema>(
        `/conversation/${id}/`,
        "GET",
        undefined,
        abortController.signal,
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
          })),
        );
      }
      if (error) {
        toast.error(
          isNotObjectObjectString(error)
            ? error
            : "Error fetching conversation history",
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

  // unified chat handler for both authenticated and public users
  const chatHandler = async (
    prompt: string,
    collection: RAGCollectionListSchema | null,
  ) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    const userMsg: Message = {
      id: uuidv4(),
      role: roleChoicesEnum.user,
      content: prompt,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsChatting(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const aiMsgId = uuidv4();
    const url = isAuthenticate ? "/chat/" : "/chat/public/";
    const body = isAuthenticate
      ? {
          conversation_id: id,
          prompt,
          collection_name: collection?.rag_collection_name,
        }
      : {
          prompt,
          history: filterHistoryMessages(messages),
        };

    await streamApi(
      url,
      {
        onStart: () => {
          // Initialize the AI message when first data arrives
          setMessages((prev) => [
            ...prev,
            { id: aiMsgId, role: roleChoicesEnum.ai, content: "" },
          ]);
          setIsChatting(false);
        },
        onNext: (data: any) => {
          if (data.type === "content") {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMsgId
                  ? { ...msg, content: msg.content + data.content }
                  : msg,
              ),
            );
          } else if (data.type === "end") {
            if (data.conversation_id) {
              if (data.conversation_id !== id) {
                setPreventRefetch(true);
              }
              navigate(`/conversation/${data.conversation_id}`);
              setSideBarContentRefetch(true);
            }
          } else if (data.type === "error") {
            toast.error(data.error);
          }
        },
        onError: (error: string) => {
          if (abortController.signal.aborted) {
            const stoppedMsg: Message = {
              id: uuidv4(),
              role: roleChoicesEnum.ai,
              content: "You stopped the response",
              type: "INTERRUPTED",
            };
            setMessages((prev) => [...prev, stoppedMsg]);
          } else {
            toast.error(error || "An unexpected error occurred");
            const errorMsg: Message = {
              id: uuidv4(),
              role: roleChoicesEnum.ai,
              content: `Error: ${error}`,
              type: "ERROR",
            };
            setMessages((prev) => [...prev, errorMsg]);
          }
        },
      },
      {
        method: "POST",
        body,
        signal: abortController.signal,
      },
    );

    setIsChatting(false);
    if (abortControllerRef.current === abortController) {
      abortControllerRef.current = null;
    }
  };

  const handlePromptSubmit = async (
    prompt: string,
    collection: RAGCollectionListSchema | null,
  ) => {
    if (prompt.trim().length === 0) {
      return;
    }
    await chatHandler(prompt, collection);
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
