import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { AppProviders } from "@/providers/app-providers";

export const metadata: Metadata = {
  title: "NEURA",
  description: "Enterprise AI Knowledge Operating System",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
