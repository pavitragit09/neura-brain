import { Suspense } from "react";
import { LoginShell } from "@/components/auth/login-shell";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginShell />
    </Suspense>
  );
}
