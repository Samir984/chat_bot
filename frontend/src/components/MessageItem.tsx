import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface MessageItemProps {
  role: "user" | "assistant";
  content: string;
  interrupted?: boolean;
}

export default function MessageItem({
  role,
  content,
  interrupted,
}: MessageItemProps) {
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
          // interrupted assistant message styling
          !isUser && interrupted
            ? "bg-amber-50 border border-amber-200 text-amber-900"
            : !isUser
            ? "bg-muted"
            : ""
        )}
      >
        {interrupted && !isUser && (
          <div className="text-xs text-amber-700 font-medium">Stopped</div>
        )}
        <div
          className={cn(
            "whitespace-pre-wrap",
            interrupted ? "italic opacity-90" : ""
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
