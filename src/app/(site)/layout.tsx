import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Anavrin Property | Find Your Next Home",
    template: "%s | Anavrin Property",
  },
  description:
    "Browse listings, connect with agents, and find the right property with Anavrin Property.",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
