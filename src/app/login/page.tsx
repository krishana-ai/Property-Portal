import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in — Anavrin Property Admin",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
