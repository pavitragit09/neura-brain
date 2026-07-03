"use client";

import { ChevronLeft, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { NeuraLogo } from "@/components/brand/neura-logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useSidebarStore } from "@/store/sidebar-store";

export function Sidebar() {
  const router = useRouter();
  const collapsed = useSidebarStore((state) => state.collapsed);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);

  function handleSignOut() {
    signOut();
    router.replace("/login");
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 240 }}
      className="sticky top-0 hidden h-screen shrink-0 border-r border-border/40 bg-card lg:flex"
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex min-w-0 flex-1 flex-col px-3 py-5">
        {/* Brand Header */}
        <div className="flex h-9 items-center justify-between gap-2 px-2.5 mb-6">
          <NeuraLogo collapsed={collapsed} />
          {!collapsed && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              aria-label="Collapse sidebar"
              className="size-7 shrink-0 hover:bg-secondary/60 text-muted-foreground/80 hover:text-foreground rounded-md transition-colors"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col gap-4">
          <SidebarNav collapsed={collapsed} />
          
          {!collapsed && (
            <div className="mx-2.5 mt-2 rounded-lg border border-border/15 bg-secondary/20 p-3 select-none">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">Evidence Engine</span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-foreground/80">
                <span>Connected Sources</span>
                <span className="font-mono font-medium">4 Active</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-foreground/80">
                <span>Context Health</span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">94% verified</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Profile Section */}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          {collapsed ? (
            <div className="flex flex-col items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleCollapsed}
                aria-label="Expand sidebar"
                className="size-8 shrink-0 hover:bg-secondary/60 text-muted-foreground rounded-md"
              >
                <ChevronLeft className="size-4 rotate-180" aria-hidden="true" />
              </Button>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-semibold border border-border/20 text-foreground select-none">
                {user?.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("") ?? "N"}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                aria-label="Sign out"
                className="size-8 shrink-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground/80 rounded-md transition-colors"
              >
                <LogOut className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 rounded-lg border border-border/10 bg-secondary/35 p-2 shadow-sm/5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-semibold border border-border/30 text-foreground select-none">
                {user?.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("") ?? "N"}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-xs font-medium text-foreground">{user?.name ?? "Workspace User"}</div>
                <div className="truncate text-[10px] text-muted-foreground/85 font-mono uppercase tracking-wider mt-0.5">
                  {user?.role ?? "admin"}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                aria-label="Sign out"
                className="size-7 shrink-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground/80 rounded-md transition-colors"
              >
                <LogOut className="size-3.5" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
