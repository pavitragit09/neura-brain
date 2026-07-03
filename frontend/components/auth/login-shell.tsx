"use client";

import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export function LoginShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signIn = useAuthStore((state) => state.signIn);
  const requestedNext = searchParams.get("next");
  const nextRoute = getSafeNextRoute(requestedNext);
  
  const [username, setUsername] = useState("alex");
  const [password, setPassword] = useState("password");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn(); // Keeps existing mock authentication flow
    router.replace(nextRoute);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-[340px] flex flex-col gap-8">
        {/* Brand logo header */}
        <div className="flex items-center gap-2.5 select-none">
          <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-sm overflow-hidden border border-border/10">
            <span className="font-mono text-[11px] font-bold tracking-tight select-none">N</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-white/10 opacity-70" />
          </div>
          <div className="min-w-0 flex flex-col leading-none">
            <span className="text-[13px] font-semibold tracking-tight text-foreground">NEURA</span>
            <span className="text-[9px] font-medium tracking-widest text-muted-foreground/75 mt-0.5">SYSTEM</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">Sign in to your workspace</h2>
          <p className="text-xs text-muted-foreground/80 leading-relaxed">
            Enter your credentials to access the NEURA secure knowledge workspace.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border/40 bg-card px-3 text-xs shadow-sm outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/5 text-foreground placeholder:text-muted-foreground/60"
              placeholder="Enter username"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-[10px] font-normal text-muted-foreground/70 hover:text-foreground transition-colors select-none">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border/40 bg-card px-3 text-xs shadow-sm outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/5 text-foreground placeholder:text-muted-foreground/60"
              placeholder="Enter password"
            />
          </div>

          <Button className="w-full justify-between h-10 mt-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 text-xs font-medium cursor-pointer" type="submit">
            Continue as Alex Morgan
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        </form>
      </section>
    </main>
  );
}

const protectedRoutes = [
  "/home",
  "/knowledge",
  "/knowledge-sources",
  "/trust",
  "/activity",
  "/settings",
] as const satisfies readonly Route[];

function getSafeNextRoute(value: string | null): Route {
  return protectedRoutes.find((route) => route === value) ?? "/home";
}
