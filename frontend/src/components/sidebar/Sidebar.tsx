import {
  Sidebar as CustomeSidebar,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarHistory } from "./SidebarHistory";
import { SidebarNavigation } from "./SidebarNavigation";
import { useAuth } from "@/context/AuthProvider";

export default function Sidebar() {
  const { isAuthenticate } = useAuth();

  return (
    <CustomeSidebar className="bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
        </div>

        <SidebarNavigation />
      </SidebarHeader>

      {isAuthenticate && <SidebarHistory />}
    </CustomeSidebar>
  );
}
