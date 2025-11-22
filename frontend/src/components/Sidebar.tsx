import {
  Sidebar as CustomeSidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

export default function Sidebar() {
  return (
    <CustomeSidebar>
      <SidebarContent>{/* sidebar content here */}</SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        {/* // footer here */}
      </SidebarFooter>
    </CustomeSidebar>
  );
}
