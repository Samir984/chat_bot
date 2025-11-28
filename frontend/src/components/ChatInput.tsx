import { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import CollectionSelector from "./CollectionSelector";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  useEffect(() => {
    adjustHeight();
  }, [input]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="w-full flex flex-col max-w-4xl mx-auto px-4 pb-4 bg-background">
      <div className="relative rounded-3xl border bg-card/50 backdrop-blur-sm p-4 ">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Anything"
          className="w-full resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 mb-4"
          rows={1}
          disabled={disabled}
          style={{ minHeight: "24px", maxHeight: "200px" }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CollectionSelector
              selectedCollection={selectedCollection}
              onCollectionSelect={setSelectedCollection}
              disabled={disabled}
            />
          </div>

          <div className="flex items-center gap-2">
            {input.trim() ? (
              <Button
                onClick={handleSend}
                size="icon"
                className="h-9 w-9 rounded-full transition-all"
                disabled={disabled}
              >
                <Send size={18} />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-accent"
                disabled={disabled}
              >
                <Mic size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
