import type { Metadata } from "next";

/**
 * Everything under /admin is internal: never indexed, never linked from the
 * public website. The console shell (sidebar, auth guard) lives in the
 * `(console)` route group so `/admin/login` can render on its own.
 */
export const metadata: Metadata = {
  title: {
    default: "Admin Console",
    template: "%s — Anavrin Admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
