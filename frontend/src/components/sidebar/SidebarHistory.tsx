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
    <SidebarContent className="px-2 flex-1 overflow-y-auto scrollbar-none">
      <SidebarGroup className="mt-4">
        <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 px-2 py-2 uppercase tracking-wider">
          Recent
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-0.5">
            {recentChats.map((chat, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
                >
                  <Link to="#" className="flex items-center gap-2.5">
                    <MessageSquare
                      size={14}
                      className="min-w-3.5 text-muted-foreground/70 transition-colors"
                    />
                    <span className="truncate text-sm">{chat}</span>
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
