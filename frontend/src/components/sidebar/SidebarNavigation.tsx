import { Folder, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

export function SidebarNavigation() {
  const { isAuthenticate } = useAuth();
  const location = useLocation();
  const isCollections = location.pathname === "/collections";

  return (
    <div className="space-y-1">
      <Button
        asChild
        className="w-full justify-start gap-3 h-9 px-3 font-normal bg-transparent hover:bg-transparent text-foreground/80"
      >
        <Link to="/">
          <SquarePen size={18} />
          <span className="text-sm">New chat</span>
        </Link>
      </Button>

      <Button
        asChild
        className={`w-full justify-start gap-3 h-9 px-3 font-normal shadow-none transition-all duration-200 ${
          isCollections
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : "text-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        }`}
        variant="ghost"
      >
        {isAuthenticate && (
          <Link to="/collections">
            <Folder
              size={16}
              className={`${
                isCollections ? "text-primary" : "text-foreground/70"
              } transition-colors`}
            />
            <span className="text-sm">Collections</span>
          </Link>
        )}
      </Button>
    </div>
  );
}
