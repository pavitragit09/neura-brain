"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getRouteTitle } from "@/lib/navigation";
import { useAuthStore } from "@/store/auth-store";

type HeaderProps = {
  mobileSidebar: ReactNode;
};

export function Header({ mobileSidebar }: HeaderProps) {
  const pathname = usePathname();
  const pageTitle = getRouteTitle(pathname);
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {mobileSidebar}
        <div className="flex items-center min-w-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground/80 font-normal">
            <span className="hover:text-foreground/80 transition-colors select-none">Workspace</span>
            <span className="text-muted-foreground/30 font-mono text-[10px] select-none">/</span>
            <span className="truncate font-medium text-foreground tracking-tight select-none">{pageTitle}</span>
            <span className="hidden sm:flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 text-[9px] font-medium tracking-wide uppercase text-emerald-600 dark:text-emerald-400 select-none">
              <span className="size-1 rounded-full bg-emerald-500" />
              Verified Context
            </span>
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          aria-label="Notifications" 
          disabled
          className="size-8 text-muted-foreground hover:text-foreground rounded-lg"
        >
          <Bell className="size-4" aria-hidden="true" />
        </Button>
        
        <div className="flex size-7 select-none items-center justify-center rounded-lg bg-secondary text-[11px] font-semibold border border-border/25 text-foreground">
          {user?.name
            .split(" ")
            .map((part) => part[0])
            .join("") ?? "N"}
        </div>
      </div>
    </header>
  );
}
