import {
  Plus,
  MessageSquare,
  Menu,
  Search,
  Folder,
  Database,
} from "lucide-react";
import {
  Sidebar as CustomeSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const collections = [
    {
      id: "project-docs",
      name: "Project Docs",
      icon: Folder,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      id: "research",
      name: "Research Papers",
      icon: Database,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      id: "create",
      name: "Create Collection",
      icon: Plus,
      color: "text-sidebar-foreground",
      bgColor: "bg-sidebar-accent",
    },
  ];

  const recentChats = [
    "Withdrawing from Side Job Opportuni...",
    "Declining Video Interview Request",
    "P50: Median, Statistics, and Applicati...",
    "JavaScript Closures: Simple Example",
    "UI Improvement Suggestions for Apar...",
    "Django JWT Access Token Validation",
    "Express MongoDB Testing and Migrat...",
    "Python S3 PDF Upload, Download, Re...",
    "QdrantClient: Vector Database Intera...",
    "Managing Object State in React",
  ];

  return (
    <CustomeSidebar className="bg-sidebar border-r-0 text-sidebar-foreground">
      <SidebarHeader className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-gray-300"
          >
            <SidebarTrigger />
          </Button>
        </div>

        <Button
          className="w-full justify-start gap-3 bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-0 shadow-none px-2 py-6"
          variant="ghost"
        >
          <div className="bg-sidebar-accent p-1 rounded-md text-sidebar-accent-foreground">
            <Plus size={18} />
          </div>
          <span className="text-lg font-normal">New chat</span>
          <div className="ml-auto bg-sidebar-accent p-2 rounded-full text-sidebar-accent-foreground">
            <MessageSquare size={16} />
          </div>
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2 scrollbar-none">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-sidebar-foreground px-4 py-2">
            Collections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collections.map((collection) => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground h-12"
                  >
                    <Link to="#" className="flex items-center gap-3 px-4">
                      <div
                        className={`p-1.5 rounded-full ${collection.bgColor} ${collection.color}`}
                      >
                        <collection.icon size={16} />
                      </div>
                      <span className="text-sm">{collection.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-sm font-medium text-sidebar-foreground px-4 py-2">
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentChats.map((chat, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground h-9"
                  >
                    <Link to="#" className="flex items-center gap-3 px-4">
                      <MessageSquare size={16} className="min-w-4" />
                      <span className="truncate text-sm">{chat}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </CustomeSidebar>
  );
}
