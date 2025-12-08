import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className={cn("flex w-full items-start gap-4 p-4")}>
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted")}>
        <Bot size={16} />
      </div>

      <div className={cn("flex max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm bg-muted rounded-tl-sm")}>
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full bg-gray-400 animate-pulse"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="inline-block h-2.5 w-2.5 rounded-full bg-gray-400 animate-pulse"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="inline-block h-2.5 w-2.5 rounded-full bg-gray-400 animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
