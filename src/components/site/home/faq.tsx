"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FAQS } from "@/lib/site/content";
import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "../motion/reveal";
import { SectionHeading } from "../section-heading";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="Questions" title="Straight answers, before you ask." />
        </div>
        <Stagger className="divide-y divide-ink-900/10 border-y border-ink-900/10">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <StaggerItem key={f.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium text-ink-900"
                  >
                    {f.q}
                    <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500", isOpen ? "rotate-45 border-ink-900 bg-ink-900 text-white" : "border-ink-900/15")}>
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 leading-relaxed text-ink-600">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
