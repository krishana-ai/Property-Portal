"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { CalendarDays, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { formatPropertyPrice, propertyHeadline } from "@/lib/site/format";
import type { Property } from "@/lib/site/types";
import { SaveButton } from "./save-button";

/**
 * Compact context once the summary scrolls away (spec §80) plus the mobile
 * sticky Call | WhatsApp | Visit bar (spec §19).
 */
export function StickyContextBar({ property: p }: { property: Property }) {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 640));

  const jumpToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            exit={{ y: -80 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed inset-x-0 top-0 z-[55] hidden border-b border-ink-900/10 bg-white/90 backdrop-blur-xl lg:block"
          >
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-8">
              <p className="min-w-0 truncate text-sm text-ink-700">
                <span className="font-semibold text-ink-900">{propertyHeadline(p)}</span> · {formatPropertyPrice(p)} · {p.locality}
              </p>
              <div className="ml-auto flex items-center gap-2">
                <SaveButton slug={p.slug} className="text-ink-900 hover:bg-ink-900/5" />
                <button type="button" onClick={jumpToContact} className="rounded-full bg-ink-900 px-5 py-2 text-sm font-semibold text-white hover:bg-ink-800">
                  Contact seller
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 gap-2 rounded-2xl bg-ink-900 p-2 shadow-2xl lg:hidden">
        <a href="tel:+911414002026" className="flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-medium text-white"><Phone className="h-4 w-4" /> Call</a>
        <a href="https://wa.me/911414002026" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-medium text-white"><MessageCircle className="h-4 w-4" /> Chat</a>
        <button type="button" onClick={jumpToContact} className="flex items-center justify-center gap-1.5 rounded-xl bg-brass-500 py-3 text-sm font-semibold text-ink-900"><CalendarDays className="h-4 w-4" /> Visit</button>
      </div>
    </>
  );
}
