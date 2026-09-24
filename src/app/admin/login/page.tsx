import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
