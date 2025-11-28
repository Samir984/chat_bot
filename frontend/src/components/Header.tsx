import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { Google } from "@ridemountainpig/svgl-react";
import { useSidebar } from "@/components/ui/sidebar";

export default function Header() {
  const { open } = useSidebar();
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-2">
        <div className="flex items-center gap-2 ">
          {!open && (
            <SidebarTrigger className="text-sidebar-foreground dark:hover:bg-gray-800 hover:text-sidebar-accent-foreground" />
          )}
          <Logo />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Google className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
