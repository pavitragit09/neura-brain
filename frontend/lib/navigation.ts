import type { Route } from "next";
import {
  Activity,
  Home,
  LibraryBig,
  LucideIcon,
  Settings,
  ShieldCheck,
  Waypoints,
} from "lucide-react";

export type NavigationItem = {
  title: string;
  href: Route;
  icon: LucideIcon;
};

export const navigationItems = [
  {
    title: "Home",
    href: "/home",
    icon: Home,
  },
  {
    title: "Knowledge",
    href: "/knowledge",
    icon: LibraryBig,
  },
  {
    title: "Knowledge Sources",
    href: "/knowledge-sources",
    icon: Waypoints,
  },
  {
    title: "Trust Engine",
    href: "/trust",
    icon: ShieldCheck,
  },
  {
    title: "Activity",
    href: "/activity",
    icon: Activity,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
] satisfies NavigationItem[];

export function getRouteTitle(pathname: string) {
  return navigationItems.find((item) => pathname.startsWith(item.href))?.title ?? "Workspace";
}
