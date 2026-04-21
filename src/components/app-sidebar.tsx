import React from "react";
import { Home, QrCode, Scan, Link2, Settings, History, Archive } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
  SidebarInput,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
const navItems = [
  { label: "Dashboard", path: "/", icon: Home },
  { label: "QR Generator", path: "/generate", icon: QrCode },
  { label: "Design Vault", path: "/vault", icon: Archive },
  { label: "QR Scanner", path: "/scan", icon: Scan },
  { label: "Link Shortener", path: "/links", icon: Link2 },
];
export function AppSidebar(): JSX.Element {
  const { pathname } = useLocation();
  const links = useQuery(api.links.list) ?? [];
  const qrCodes = useQuery(api.qr.list) ?? [];
  const totalItems = links.length + qrCodes.length;
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center justify-center border-b">
        <div className="flex items-center gap-3 px-4 w-full">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Link2 className="text-white h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-data-[collapsible=icon]:hidden">
            OmniLink
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Toolkit
          </SidebarGroupLabel>
          <SidebarMenu className="px-2 space-y-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.path}
                  tooltip={item.label}
                  className="transition-all duration-200 hover:bg-accent group"
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 ${pathname === item.path ? 'text-indigo-500' : 'text-muted-foreground group-hover:text-foreground'}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="mx-2 my-4 opacity-50" />
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Analytics
          </SidebarGroupLabel>
          <SidebarMenu className="px-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="History">
                <Link to="/links" className="flex items-center gap-3">
                  <History className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Recent Activity</span>
                </Link>
              </SidebarMenuButton>
              {totalItems > 0 && (
                <SidebarMenuBadge className="bg-indigo-500/10 text-indigo-500 font-bold">
                  {totalItems}
                </SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t bg-muted/30">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Infrastructure v2.5</p>
          <p className="text-xs text-muted-foreground/80">Pro Toolkit Ready</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}