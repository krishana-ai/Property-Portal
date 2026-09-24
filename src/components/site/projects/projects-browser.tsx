"use client";

import { AnimatePresence, motion } from "motion/react";
import { Building, Calendar, FileCheck2, MapPin, Ruler } from "lucide-react";
import Image from "next/image";
import { blurProps } from "@/lib/site/images";
import Link from "next/link";
import { useState } from "react";
import { PROJECTS } from "@/lib/site/catalog";
import { formatPrice } from "@/lib/site/format";
import type { Project } from "@/lib/site/types";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "../motion/reveal";

const STATUSES = ["All", "New Launch", "Under Construction", "Ready to Move", "Upcoming"] as const;

export function ProjectsBrowser() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const list = PROJECTS.filter((p) => status === "All" || p.status === status);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div role="tablist" aria-label="Project status" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
        {STATUSES.map((s) => (
          <button key={s} role="tab" aria-selected={status === s} onClick={() => setStatus(s)} className={cn("relative shrink-0 rounded-full px-4 py-2 text-sm font-medium", status === s ? "text-white" : "text-ink-700 hover:bg-ink-900/5")}>
            {status === s && <motion.span layoutId="project-status" className="absolute inset-0 rounded-full bg-ink-900" />}
            <span className="relative">{s}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="mt-10 grid gap-8 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.7, ease: EASE_OUT } }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && <p className="mt-10 text-center text-ink-600">No projects with this status yet in Jaipur.</p>}
    </div>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const [requested, setRequested] = useState(false);
  return (
    <article className="group overflow-hidden rounded-[28px] bg-white ring-1 ring-ink-900/[0.06] transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgb(11_17_32/0.35)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={p.image} {...blurProps(p.image)} alt={p.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-900 backdrop-blur">{p.status}</span>
        <div className="absolute bottom-4 left-5 text-white">
          <p className="text-sm text-white/70">by {p.developer}</p>
          <h3 className="font-display text-3xl">{p.name}</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-2xl font-semibold text-ink-900">{formatPrice(p.priceFrom)} – {formatPrice(p.priceTo)}</p>
          <p className="text-sm text-ink-600">{p.configurations}</p>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Meta icon={MapPin} label="Locality" value={p.locality} />
          <Meta icon={Calendar} label="Possession" value={p.possession} />
          <Meta icon={Building} label="Units" value={String(p.units)} />
          <Meta icon={Ruler} label="Land" value={`${p.acres} acres`} />
        </dl>
        <p className="mt-5 flex items-center gap-2 text-xs text-sky-700"><FileCheck2 className="h-4 w-4" /> RERA: {p.rera}</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={() => setRequested(true)} className="relative flex-1 overflow-hidden rounded-full bg-ink-900 py-3 text-sm font-semibold text-white transition hover:bg-ink-800">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={String(requested)} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} className="block">
                {requested ? "Brochure on its way ✓" : "Get brochure"}
              </motion.span>
            </AnimatePresence>
          </button>
          <Link href={`/search?intent=buy&loc=${encodeURIComponent(p.locality)}`} className="rounded-full border border-ink-900/15 px-5 py-3 text-sm font-semibold text-ink-900 hover:bg-sand-100">Units</Link>
        </div>
      </div>
    </article>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-ink-600"><Icon className="h-3 w-3" /> {label}</dt>
      <dd className="mt-0.5 font-semibold text-ink-900">{value}</dd>
    </div>
  );
}
