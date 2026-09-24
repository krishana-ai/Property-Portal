"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowLeft, ArrowRight, TrendingUp } from "lucide-react";
import Image from "next/image";
import { blurProps } from "@/lib/site/images";
import Link from "next/link";
import { useRef } from "react";
import { LOCALITIES, PRICE_DATA_PERIOD } from "@/lib/site/catalog";
import { formatPrice } from "@/lib/site/format";
import { Reveal } from "../motion/reveal";
import { SectionHeading } from "../section-heading";

export function Localities() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const cursorY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const cursorScale = useSpring(0, { stiffness: 300, damping: 25 });

  const scrollBy = (dir: 1 | -1) => trackRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });

  return (
    <section className="overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Locality intelligence"
          title="Know the neighbourhood before the visit."
          description="Average sale price, rent and year-on-year movement for the areas people search most."
          action={
            <div className="flex gap-2">
              <button type="button" aria-label="Previous localities" onClick={() => scrollBy(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-ink-900/15 transition hover:bg-ink-900 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button type="button" aria-label="Next localities" onClick={() => scrollBy(1)} className="grid h-12 w-12 place-items-center rounded-full border border-ink-900/15 transition hover:bg-ink-900 hover:text-white">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          }
        />
      </div>

      <Reveal className="relative mt-14">
        <div
          ref={trackRef}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            cursorX.set(e.clientX - r.left);
            cursorY.set(e.clientY - r.top);
          }}
          onPointerEnter={(e) => e.pointerType === "mouse" && cursorScale.set(1)}
          onPointerLeave={() => cursorScale.set(0)}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        >
          {LOCALITIES.map((l) => (
            <Link
              key={l.slug}
              href={`/search?intent=buy&loc=${encodeURIComponent(l.name)}`}
              className="group relative h-[440px] w-[300px] shrink-0 snap-start overflow-hidden rounded-3xl sm:w-[340px]"
            >
              <Image src={l.image} {...blurProps(l.image)} alt={`${l.name}, ${l.city}`} fill sizes="340px" className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs text-white/60">{l.listings} active listings</p>
                <h3 className="mt-1 font-display text-3xl">{l.name}</h3>
                <p className="mt-1 text-sm text-white/70">{l.tagline}</p>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-sm transition-transform duration-500 group-hover:-translate-y-1">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-white/50">Avg. sale</p>
                    <p className="font-semibold">₹{l.avgPriceSqft.toLocaleString("en-IN")}/sq.ft</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-white/50">Rent from</p>
                    <p className="font-semibold">{formatPrice(l.rentFrom)}/mo</p>
                  </div>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  <TrendingUp className="h-3.5 w-3.5" /> +{l.yoy}% YoY
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Custom drag cursor on desktop */}
        <motion.div
          aria-hidden
          style={{ x: cursorX, y: cursorY, scale: cursorScale }}
          className="pointer-events-none absolute left-0 top-0 z-20 -ml-11 -mt-11 hidden h-[88px] w-[88px] place-items-center rounded-full bg-brass-500 text-xs font-bold uppercase tracking-wider text-ink-900 lg:grid"
        >
          View
        </motion.div>
      </Reveal>

      <p className="mx-auto mt-6 max-w-7xl px-4 text-xs text-ink-600 sm:px-6 lg:px-8">
        Data period: {PRICE_DATA_PERIOD}. Based on listed asking prices, not registered transactions.
      </p>
    </section>
  );
}
