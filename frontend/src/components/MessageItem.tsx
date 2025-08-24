import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Message } from "@/types/chat";
import { Bot, User } from "lucide-react";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-4 p-6 ${isUser ? "bg-background" : "bg-muted/50"}`}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback
          className={
            isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
          }
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isUser ? "You" : "ChatBot"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
