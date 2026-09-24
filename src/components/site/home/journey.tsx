"use client";

import { AnimatePresence, motion, useInView, useScroll } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { JOURNEY } from "@/lib/site/content";
import { blurProps, IMG } from "@/lib/site/images";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../section-heading";

const VISUALS = [IMG.apartmentPark, IMG.livingWarm, IMG.villaRow, IMG.heroVilla];

export function Journey() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });

  return (
    <section className="bg-sand-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From first search to site visit, without the runaround."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Sticky visual that swaps with the active step */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[32px]">
              {/* All visuals stay mounted (so they load up front) and crossfade with a slow zoom. */}
              {VISUALS.map((src, i) => (
                <motion.div
                  key={src}
                  initial={false}
                  animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.12 }}
                  transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute inset-0"
                >
                  <Image src={src} {...blurProps(src)} alt="" fill sizes="50vw" className="object-cover" />
                </motion.div>
              ))}
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-6 left-6 z-10 font-display text-7xl leading-none text-white/90"
                >
                  {JOURNEY[active].step}
                </motion.span>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
              <span className="absolute bottom-7 right-6 text-xs uppercase tracking-[0.2em] text-white/70">
                Step {active + 1} of {JOURNEY.length}
              </span>
            </div>
          </div>

          <ol ref={listRef} className="relative">
            {/* Scroll-linked progress rail */}
            <span className="absolute bottom-0 left-[19px] top-0 w-px bg-ink-900/10" aria-hidden />
            <motion.span style={{ scaleY: scrollYProgress }} className="absolute bottom-0 left-[19px] top-0 w-px origin-top bg-brass-600" aria-hidden />
            {JOURNEY.map((s, i) => (
              <JourneyStep key={s.step} index={i} active={active === i} onActive={setActive} {...s} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function JourneyStep({
  index, step, title, body, active, onActive,
}: { index: number; step: string; title: string; body: string; active: boolean; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="relative flex gap-8 pb-20 last:pb-0 lg:min-h-[42vh]">
      <span
        className={cn(
          "relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border text-xs font-bold transition-all duration-500",
          active ? "scale-110 border-brass-600 bg-brass-500 text-ink-900" : "border-ink-900/15 bg-sand-50 text-ink-600",
        )}
      >
        {step}
      </span>
      <div className={cn("pt-1 transition-opacity duration-500", active ? "opacity-100" : "opacity-45")}>
        <h3 className="font-display text-3xl leading-tight text-ink-900 sm:text-4xl">{title}</h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-ink-600">{body}</p>
        <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl lg:hidden">
          <Image src={VISUALS[index]} {...blurProps(VISUALS[index])} alt="" fill sizes="100vw" className="object-cover" />
        </div>
      </div>
    </li>
  );
}
