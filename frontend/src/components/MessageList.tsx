import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import TypingIndicator from "./chat/TypingIndicator";
import type { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          role={msg.role}
          content={msg.content}
          type={msg.type}
        />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
