import { Bot } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-1 group">
      <div className="font-bold text-md">ChatBot</div>
      <div className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
        <Bot className="h-6 w-6 relative text-primary" />
      </div>
    </div>
  );
}
