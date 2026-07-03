"use client";

import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <Toaster richColors position="bottom-right" closeButton />
      </QueryProvider>
    </ThemeProvider>
  );
}
