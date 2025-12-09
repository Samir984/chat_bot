import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

type MessageItemProps = Omit<ChatMessage, "id">;

export default function MessageItem({ role, content, type }: MessageItemProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 p-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "rounded-tl-sm",
          // interrupted assistant message: subtle, greyed-out (not red)
          !isUser && type === "INTERRUPTED"
            ? "bg-muted/60 border border-dashed border-slate-200 text-muted-foreground"
            : !isUser && type === "ERROR"
            ? "bg-rose-50 border border-rose-200 text-rose-900"
            : !isUser
            ? "bg-muted"
            : ""
        )}
      >
        {type === "INTERRUPTED" && !isUser && (
          <div className="text-xs text-muted-foreground/80 font-medium">
            Stopped
          </div>
        )}
        <div
          className={cn(
            "whitespace-pre-wrap",
            type === "INTERRUPTED"
              ? "italic opacity-80 text-muted-foreground"
              : ""
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
