import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { Suspense } from "react";
import { MobileTabBar } from "@/components/site/layout/mobile-tab-bar";
import { ScrollProgress } from "@/components/site/layout/scroll-progress";
import { SiteFooter } from "@/components/site/layout/site-footer";
import { SiteHeader } from "@/components/site/layout/site-header";
import { SmoothScroll } from "@/components/site/layout/smooth-scroll";

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  // Resolves relative Open Graph image paths into absolute URLs.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Anavrin Property | Verified homes, rentals & plots in Jaipur",
    template: "%s | Anavrin Property",
  },
  description:
    "Search verified flats, villas, rentals, PGs, plots and new projects in Jaipur. Real photos, honest prices and sellers who reply.",
  openGraph: {
    type: "website",
    siteName: "Anavrin Property",
    locale: "en_IN",
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} site min-h-screen overflow-x-clip`}>
      <a href="#main" className="sr-only z-[70] rounded-full bg-ink-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <SmoothScroll>
        <ScrollProgress />
        <Suspense fallback={<div className="h-[72px]" />}>
          <SiteHeader />
        </Suspense>
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileTabBar />
      </SmoothScroll>
    </div>
  );
}
