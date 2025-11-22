import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
