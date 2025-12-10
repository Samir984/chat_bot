import {
  Sidebar as CustomeSidebar,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarHistory } from "./SidebarHistory";
import { SidebarNavigation } from "./SidebarNavigation";

export default function Sidebar() {
  
  return (
    <CustomeSidebar className="bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
        </div>

        <SidebarNavigation />
      </SidebarHeader>

      <SidebarHistory />
    </CustomeSidebar>
  );
}
