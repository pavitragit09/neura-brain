"use client";

import { getFirstName, getTimeOfDayGreeting } from "@/lib/greeting";
import { useAuthStore } from "@/store/auth-store";

export function HomeGreeting() {
  const user = useAuthStore((state) => state.user);
  const firstName = getFirstName(user?.name ?? "there");
  const greeting = getTimeOfDayGreeting();

  return (
    <section className="space-y-2 text-center select-none">
      <h2 className="text-3xl font-medium tracking-tight text-foreground/90 sm:text-4xl">
        {greeting}, {firstName}
      </h2>
      <p className="text-sm text-muted-foreground/75 font-normal tracking-wide">
        Search and analyze your organization&apos;s knowledge base.
      </p>
    </section>
  );
}
