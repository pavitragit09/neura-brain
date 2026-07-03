import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header mobileSidebar={<MobileSidebar />} />
          <main className="min-h-0 flex-1 px-6 py-8 sm:px-10 lg:px-12 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
