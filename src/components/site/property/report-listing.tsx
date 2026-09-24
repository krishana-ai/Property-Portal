"use client";

import { AnimatePresence, motion } from "motion/react";
import { Flag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const REASONS = ["Wrong information", "Duplicate listing", "Fraud / suspicious", "Wrong price", "Property unavailable", "Other"];

export function ReportListing() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  return (
    <div className="rounded-3xl border border-dashed border-ink-900/15 p-6">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900">
        <Flag className="h-4 w-4" /> Report this listing
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {sent ? (
              <p className="pt-4 text-sm text-emerald-700">Thanks — our moderation team will review this listing.</p>
            ) : (
              <div className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {REASONS.map((r) => (
                    <button key={r} type="button" onClick={() => setReason(r)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition", reason === r ? "border-ink-900 bg-ink-900 text-white" : "border-ink-900/12 hover:border-ink-900/40")}>
                      {r}
                    </button>
                  ))}
                </div>
                <button type="button" disabled={!reason} onClick={() => setSent(true)} className="mt-4 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">
                  Submit report
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
