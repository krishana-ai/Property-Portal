"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import Image from "next/image";
import { blurProps } from "@/lib/site/images";
import Link from "next/link";
import { useState } from "react";
import { LOCALITIES } from "@/lib/site/catalog";
import { formatPrice, propertyHeadline } from "@/lib/site/format";
import type { Property } from "@/lib/site/types";
import { cn } from "@/lib/utils";

/** Approximate label positions for the stylised Jaipur map. */
const LABELS: Record<string, { x: number; y: number }> = {
  "Vaishali Nagar": { x: 22, y: 32 },
  "C-Scheme": { x: 48, y: 30 },
  "Malviya Nagar": { x: 62, y: 50 },
  Jagatpura: { x: 78, y: 66 },
  Mansarovar: { x: 30, y: 80 },
  "Ajmer Road": { x: 10, y: 52 },
};

interface ResultsMapProps {
  properties: Property[];
  activeSlug: string | null;
  onActive: (slug: string | null) => void;
  className?: string;
}

/**
 * Stylised, dependency-free map (spec §15 — map is a second search mode).
 * Positions are approximate by design; swap for Mapbox/Google once keys exist.
 */
export function ResultsMap({ properties, activeSlug, onActive, className }: ResultsMapProps) {
  const [selected, setSelected] = useState<Property | null>(null);

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-[#E9E4D8] ring-1 ring-ink-900/10", className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="blocks" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#E9E4D8" />
            <rect x="0.6" y="0.6" width="4.8" height="4.8" rx="0.6" fill="#E2DCCD" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#blocks)" />
        <path d="M-5 70 C 20 60, 35 75, 55 62 S 85 40, 105 48" stroke="#BFD4DA" strokeWidth="3.5" fill="none" />
        {/* Arterial roads */}
        {[
          "M0 45 L100 38", "M48 0 L52 100", "M10 100 L70 0", "M0 85 L100 70", "M20 0 L35 100", "M100 90 L60 20",
        ].map((d) => (
          <path key={d} d={d} stroke="#FBF9F4" strokeWidth="1.2" fill="none" />
        ))}
        <circle cx="60" cy="72" r="7" fill="#CFDDBF" />
        <circle cx="40" cy="20" r="5" fill="#CFDDBF" />
      </svg>

      {LOCALITIES.map((l) => {
        const pos = LABELS[l.name];
        return pos ? (
          <span key={l.slug} className="pointer-events-none absolute -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-700/55" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
            {l.name}
          </span>
        ) : null;
      })}

      {properties.map((p, i) => {
        const active = activeSlug === p.slug || selected?.slug === p.slug;
        return (
          <motion.button
            key={p.slug}
            type="button"
            initial={{ opacity: 0, y: -20, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: active ? 1.12 : 1 }}
            transition={{ delay: i * 0.03, type: "spring", stiffness: 420, damping: 24 }}
            onPointerEnter={() => onActive(p.slug)}
            onPointerLeave={() => onActive(null)}
            onClick={() => setSelected(p)}
            aria-label={`${p.title}, ${formatPrice(p.price, { compact: true })}`}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${p.map.x}%`, top: `${p.map.y}%`, zIndex: active ? 20 : 10 }}
          >
            {active && <span className="animate-pin-ping absolute inset-x-3 bottom-0 top-1 rounded-full bg-brass-500/60" />}
            <span
              className={cn(
                "relative block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold shadow-lg transition-colors",
                active ? "bg-ink-900 text-brass-300" : "bg-white text-ink-900",
              )}
            >
              {formatPrice(p.price, { compact: true })}
              {p.priceIsMonthly && <span className="font-medium opacity-70">/mo</span>}
            </span>
            <span className={cn("mx-auto block h-2 w-2 -translate-y-1 rotate-45", active ? "bg-ink-900" : "bg-white")} />
          </motion.button>
        );
      })}

      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-x-3 bottom-3 z-30 flex gap-3 rounded-2xl bg-white p-2 shadow-2xl"
          >
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
              <Image src={selected.images[0]} {...blurProps(selected.images[0])} alt="" fill sizes="96px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1 py-1">
              <p className="truncate text-xs text-ink-600">{propertyHeadline(selected)} · {selected.locality}</p>
              <p className="truncate font-semibold text-ink-900">{selected.title}</p>
              <Link href={`/property/${selected.slug}`} className="mt-1 inline-block text-sm font-semibold text-brass-700 hover:underline">
                View property →
              </Link>
            </div>
            <button type="button" aria-label="Close preview" onClick={() => setSelected(null)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand-100">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-ink-700 backdrop-blur">
        Approximate locations · {properties.length} shown
      </p>
    </div>
  );
}
