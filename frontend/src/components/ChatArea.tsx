import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";
import { Send } from "lucide-react";
import type { Conversation } from "@/types/chat";

interface ChatAreaProps {
  conversation: Conversation | null;
  onSendMessage: (content: string) => void;
}

export function ChatArea({ conversation, onSendMessage }: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      await onSendMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Welcome to ChatBot
          </h2>
          <p className="text-muted-foreground max-w-md">
            Start a new conversation by clicking "New Chat" in the sidebar or
            type a message below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="divide-y">
            {conversation.messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
          {isLoading && (
            <div className="flex gap-4 p-6 bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">ChatBot</div>
                <div className="text-sm text-muted-foreground">Thinking...</div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="flex gap-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              disabled={isLoading}
              className="pr-12 min-h-[50px] resize-none"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
