"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { PROPERTIES } from "@/lib/site/catalog";
import type { Intent } from "@/lib/site/types";
import { cn } from "@/lib/utils";
import { LinkArrow } from "../link-arrow";
import { EASE_OUT } from "../motion/reveal";
import { PropertyCard } from "../property/property-card";
import { SectionHeading } from "../section-heading";

const TABS: { id: Intent; label: string }[] = [
  { id: "buy", label: "For sale" },
  { id: "rent", label: "For rent" },
  { id: "pg", label: "PG" },
  { id: "commercial", label: "Commercial" },
];

export function FeaturedListings() {
  const [tab, setTab] = useState<Intent>("buy");
  const items = PROPERTIES.filter((p) => p.intent === tab).sort((a, b) => a.postedDaysAgo - b.postedDaysAgo).slice(0, 3);

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Fresh this week"
          title="Recently added in Jaipur."
          description="Every card shows the real price per sq.ft, when it was last updated and who posted it."
          action={<LinkArrow href={`/search?intent=${tab}`}>View all</LinkArrow>}
        />

        <div role="tablist" aria-label="Listing type" className="mt-10 inline-flex rounded-full bg-sand-100 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn("relative rounded-full px-5 py-2 text-sm font-medium transition-colors", tab === t.id ? "text-white" : "text-ink-700 hover:text-ink-900")}
            >
              {tab === t.id && <motion.span layoutId="featured-tab" className="absolute inset-0 rounded-full bg-ink-900" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: 20, transition: { duration: 0.25 } }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((p) => (
              <motion.div
                key={p.slug}
                variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } } }}
              >
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
