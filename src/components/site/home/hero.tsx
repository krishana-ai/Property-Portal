"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, BadgeCheck, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { blurProps, IMG } from "@/lib/site/images";
import { EASE_OUT } from "../motion/reveal";
import { SplitText } from "../motion/split-text";
import { HeroSearch } from "./hero-search";

const SLIDES = [
  { src: IMG.heroVilla, caption: "Contemporary villa · C-Scheme" },
  { src: IMG.heroHawaMahal, caption: "Hawa Mahal · Walled City" },
  { src: IMG.heroJalMahal, caption: "Jal Mahal · Amer Road" },
  { src: IMG.jaipurSkyline, caption: "Jaipur from the Aravallis" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink-950 pb-16 pt-32 text-white sm:items-center sm:pb-24">
      {/* Crossfading, slowly zooming photography */}
      <motion.div style={{ scale: imageScale }} className="absolute inset-0 -z-10">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.18 }}
            animate={{ opacity: 1, scale: 1.04 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6, ease: "easeInOut" }, scale: { duration: 8, ease: "linear" } }}
            className="absolute inset-0"
          >
            <Image src={SLIDES[index].src} {...blurProps(SLIDES[index].src)} alt="" fill priority={index === 0} sizes="100vw" quality={80} className="object-cover" {...blurProps(SLIDES[index].src)} />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/35 to-ink-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(11_17_32/0.75),transparent_60%)]" />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="eyebrow text-brass-300"
        >
          Jaipur&apos;s verified property marketplace
        </motion.p>

        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.75rem)] font-normal leading-[0.98] tracking-[-0.02em]">
          <SplitText text="Find the home" immediate delay={0.15} />{" "}
          <SplitText text="that fits your" immediate delay={0.35} />{" "}
          <SplitText text="life." immediate delay={0.55} wordClassName="italic text-brass-300" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: EASE_OUT }}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
        >
          Real photos, honest prices and sellers who actually reply. Search 2,400+ checked homes, rentals, PGs and plots.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: EASE_OUT }}
          className="mt-10"
        >
          <HeroSearch />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-white/70"
        >
          <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-400" /> Every “Verified” badge is checked on site</span>
          <span className="flex items-center gap-2">
            <span className="flex text-brass-300">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</span>
            4.8 from 3,100+ reviews
          </span>
        </motion.div>
      </motion.div>

      {/* Slide indicator + caption */}
      <div className="absolute bottom-8 right-6 hidden items-center gap-4 text-xs text-white/70 lg:flex">
        <AnimatePresence mode="wait">
          <motion.span key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}>
            {SLIDES[index].caption}
          </motion.span>
        </AnimatePresence>
        <div className="flex gap-1.5">
          {SLIDES.map((s, i) => (
            <button key={s.src} type="button" aria-label={`Show image ${i + 1}`} onClick={() => setIndex(i)} className="relative h-1 w-8 overflow-hidden rounded-full bg-white/25">
              {i === index && (
                <motion.span className="absolute inset-y-0 left-0 bg-white" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 6.5, ease: "linear" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <motion.a
        href="#discover"
        aria-label="Scroll to explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60 md:flex"
      >
        Scroll
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
