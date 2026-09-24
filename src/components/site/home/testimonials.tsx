"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import Image from "next/image";
import { blurProps } from "@/lib/site/images";
import { useEffect, useState } from "react";
import { TESTIMONIALS } from "@/lib/site/content";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "../motion/reveal";

export function Testimonials() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = (step: number) => {
    setDir(step);
    setI((cur) => (cur + step + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDir(1);
      setI((cur) => (cur + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(id);
  }, [paused]);

  const t = TESTIMONIALS[i];

  return (
    <section
      className="grain relative overflow-hidden bg-ink-900 py-24 text-white lg:py-32"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-brass-500/15 blur-[120px]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="eyebrow text-brass-300">In their words</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">Buyers, renters, owners and agents on Anavrin.</h2>
          <div className="mt-10 flex gap-2">
            <button type="button" aria-label="Previous testimonial" onClick={() => go(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-white/20 transition hover:bg-white hover:text-ink-900">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Next testimonial" onClick={() => go(1)} className="grid h-12 w-12 place-items-center rounded-full border border-white/20 transition hover:bg-white hover:text-ink-900">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[340px]" aria-live="polite">
          <Quote className="absolute -left-3 -top-14 h-16 w-16 text-brass-500/20" aria-hidden />
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: dir * -60, filter: "blur(8px)" }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="relative"
            >
              <blockquote className="font-display text-[clamp(1.5rem,2.8vw,2.3rem)] leading-[1.3] text-white/95">“{t.quote}”</blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                <span className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-brass-500/60">
                  <Image src={t.image} {...blurProps(t.image)} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span>
                  <span className="block font-semibold">{t.name}</span>
                  <span className="block text-sm text-white/55">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="mt-10 flex gap-2">
            {TESTIMONIALS.map((x, idx) => (
              <button
                key={x.name}
                type="button"
                aria-label={`Show testimonial ${idx + 1}`}
                onClick={() => {
                  setDir(idx > i ? 1 : -1);
                  setI(idx);
                }}
                className={cn("h-1.5 rounded-full transition-all duration-500", idx === i ? "w-10 bg-brass-400" : "w-4 bg-white/20 hover:bg-white/40")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
