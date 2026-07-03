import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/navigation";
import { motion } from "framer-motion";

type SidebarNavProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="space-y-1 px-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "relative flex h-9 items-center gap-3 rounded-md px-2.5 text-[13px] font-normal transition-all duration-150 ease-out select-none",
              active
                ? "bg-secondary/70 text-foreground font-medium border border-border/10 shadow-sm/5"
                : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
              collapsed && "justify-center px-0 size-9 mx-auto",
            )}
            aria-current={active ? "page" : undefined}
            title={collapsed ? item.title : undefined}
          >
            <Icon
              className={cn(
                "size-4 shrink-0 transition-colors duration-150",
                active ? "text-primary" : "text-muted-foreground/80"
              )}
              aria-hidden="true"
            />
            {!collapsed ? <span className="truncate tracking-tight">{item.title}</span> : null}
            {active && !collapsed && (
              <motion.div
                layoutId="active-nav-indicator"
                className="absolute left-1 h-3.5 w-0.5 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

