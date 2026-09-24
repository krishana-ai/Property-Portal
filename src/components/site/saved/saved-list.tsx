"use client";

import { AnimatePresence, motion } from "motion/react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useSavedProperties } from "@/hooks/use-saved-properties";
import { PROPERTIES } from "@/lib/site/catalog";
import { EASE_OUT } from "../motion/reveal";
import { PropertyCard } from "../property/property-card";

export function SavedList() {
  const { saved } = useSavedProperties();
  const items = PROPERTIES.filter((p) => saved.includes(p.slug));

  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] bg-white p-12 text-center ring-1 ring-ink-900/[0.06] sm:p-20">
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-500"
        >
          <Heart className="h-7 w-7" />
        </motion.span>
        <h2 className="mt-6 font-display text-3xl text-ink-900">Nothing saved yet</h2>
        <p className="mx-auto mt-3 max-w-sm text-ink-600">Tap the heart on any property to shortlist it. Your list stays on this device — no login needed.</p>
        <Link href="/search" className="mt-8 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
          Start exploring
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {items.map((p, i) => (
          <motion.div
            key={p.slug}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06, ease: EASE_OUT, duration: 0.6 } }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
          >
            <PropertyCard property={p} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
