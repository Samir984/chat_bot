import { Folder, SquarePen } from "lucide-react";
import {
  Sidebar as CustomeSidebar,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { SidebarHistory } from "./SidebarHistory";

export default function Sidebar() {
  const location = useLocation();
  const isCollections = location.pathname === "/collections";

  return (
    <CustomeSidebar className="bg-sidebar border-r-0 text-sidebar-foreground">
      <SidebarHeader className="px-2 py-3">
        <div className="flex items-center justify-between mb-2 px-2">
          <SidebarTrigger className="text-sidebar-foreground dark:hover:bg-gray-7800 hover:text-sidebar-accent-foreground" />
        </div>

        <div className="space-y-1 mb-4">
          <Button
            className="w-full justify-start gap-2 h-9 px-2 font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-none"
            variant="ghost"
          >
            <SquarePen size={18} />
            <span className="text-sm">New chat</span>
          </Button>

          <Button
            asChild
            className={`w-full justify-start gap-2 h-9 px-2 font-normal shadow-none ${
              isCollections
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
            variant="ghost"
          >
            <Link to="/collections">
              <Folder size={18} />
              <span className="text-sm">Collections</span>
            </Link>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarHistory />
    </CustomeSidebar>
  );
}
