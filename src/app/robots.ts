import type { MetadataRoute } from "next";

/** Keep the admin console and private account pages out of search engines. */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/account", "/saved"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
