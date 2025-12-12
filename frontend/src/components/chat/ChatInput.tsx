import { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import CollectionSelector from "@/components/collections/CollectionSelector";

interface ChatInputProps {
  onSubmit: (prompt: string) => void;
  isProcessingPreviousPrompt: boolean;
  abortCurrentRequest: () => void;
}

export default function ChatInput({
  onSubmit,
  isProcessingPreviousPrompt,
  abortCurrentRequest,
}: ChatInputProps) {
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

  const handleSumit = () => {
    if (!input.trim()) return;
    if (isProcessingPreviousPrompt === false) {
      onSubmit(input);
      setInput("");
      return;
    }
    abortCurrentRequest();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSumit();
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
      <div className="relative rounded-3xl border border-blue-900 backdrop-blur-sm p-4  ">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Anything"
          className="w-full resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 mb-4"
          rows={1}
          style={{ minHeight: "24px", maxHeight: "200px" }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CollectionSelector
              selectedCollection={selectedCollection}
              onCollectionSelect={setSelectedCollection}
            />
          </div>

          <div className="flex items-center gap-2">
            {input.trim() ? (
              <Button
                onClick={handleSumit}
                size="icon"
                className="h-9 w-9 rounded-full transition-all"
              >
                <Send size={18} />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-accent"
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
