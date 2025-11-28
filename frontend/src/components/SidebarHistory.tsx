import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
export function SidebarHistory() {
  return (
    <SidebarContent className="px-1 flex-1 overflow-y-auto scrollbar-none">
      <SidebarGroup className="mt-2">
        <SidebarGroupLabel className="text-sm font-medium text-sidebar-foreground px-2 py-2">
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
                  <Link to="#" className="flex items-center gap-2 px-2">
                    <MessageSquare size={16} className="min-w-4" />
                    <span className="truncate text-xs">{chat}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
