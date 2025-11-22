import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bot } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div className="hidden md:block h-6 w-px bg-border" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
