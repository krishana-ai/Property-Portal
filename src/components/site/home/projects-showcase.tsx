"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Calendar, FileCheck2 } from "lucide-react";
import Image from "next/image";
import { blurProps } from "@/lib/site/images";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/lib/site/catalog";
import { formatPrice } from "@/lib/site/format";
import { LinkArrow } from "../link-arrow";

/**
 * Pinned horizontal scroller: the section is as tall as the track is wide, and
 * vertical scroll progress drives horizontal translation.
 */
export function ProjectsShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative bg-ink-950 text-white" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="grain sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 flex w-full max-w-7xl items-end justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div>
            <p className="eyebrow text-brass-300">New projects</p>
            <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.04]">RERA-registered launches worth a visit.</h2>
          </div>
          <LinkArrow href="/projects" tone="light" className="hidden sm:inline-flex">All projects</LinkArrow>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {PROJECTS.map((p, i) => (
            <Link
              key={p.slug}
              href="/projects"
              className="group relative h-[58vh] min-h-[380px] w-[78vw] shrink-0 overflow-hidden rounded-[28px] sm:w-[520px]"
            >
              <Image src={p.image} {...blurProps(p.image)} alt={p.name} fill sizes="520px" className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
              <span className="absolute left-6 top-6 font-display text-6xl text-white/25">{String(i + 1).padStart(2, "0")}</span>
              <span className="absolute right-6 top-6 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">{p.status}</span>
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="text-sm text-white/60">{p.developer} · {p.locality}</p>
                <h3 className="mt-1 font-display text-4xl">{p.name}</h3>
                <p className="mt-3 text-lg font-semibold text-brass-300">{formatPrice(p.priceFrom)} – {formatPrice(p.priceTo)}</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70">
                  <span>{p.configurations}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Possession {p.possession}</span>
                  <span className="inline-flex items-center gap-1"><FileCheck2 className="h-3.5 w-3.5" /> RERA {p.rera}</span>
                </div>
              </div>
              <span className="absolute bottom-7 right-7 grid h-12 w-12 place-items-center rounded-full bg-brass-500 text-ink-900 opacity-0 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </Link>
          ))}
        </motion.div>

        <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-px w-full bg-white/10">
            <motion.div style={{ width: progress }} className="h-px bg-brass-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
