"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { useAuthStore } from "@/store/auth-store";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const mounted = useMounted();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, mounted, pathname, router]);

  if (!mounted || !isAuthenticated) {
    return <div className="min-h-screen bg-background" aria-hidden="true" />;
  }

  return children;
}
