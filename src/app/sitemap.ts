import type { MetadataRoute } from "next";
import { PROPERTIES } from "@/lib/site/catalog";
import { INTENTS } from "@/lib/site/search";

/** Public, indexable pages only (spec §64 — no arbitrary filter combinations). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/post-property`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...INTENTS.map((i) => ({ url: `${base}/search?intent=${i.id}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
    ...PROPERTIES.map((p) => ({ url: `${base}/property/${p.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
