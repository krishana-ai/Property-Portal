import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerLogin } from "@/components/site/auth/customer-login";

export const metadata: Metadata = {
  title: "Log in or sign up",
  robots: { index: false, follow: true },
};

/** Website login for buyers, tenants, owners and agents. Admin sign-in is at /admin/login. */
export default function LoginPage() {
  return (
    <Suspense>
      <CustomerLogin />
    </Suspense>
  );
}
