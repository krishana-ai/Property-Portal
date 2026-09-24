import type { Metadata } from "next";
import { AccountView } from "@/components/site/account/account-view";

export const metadata: Metadata = {
  title: "My account",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountView />;
}
