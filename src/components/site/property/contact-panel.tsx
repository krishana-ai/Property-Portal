"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Check, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { propertyHeadline } from "@/lib/site/format";
import type { Property } from "@/lib/site/types";
import { cn } from "@/lib/utils";

type Mode = "enquire" | "visit";
const METHODS = ["Call", "WhatsApp", "Email"] as const;
const SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "3:30 PM", "5:00 PM", "6:30 PM"];

/**
 * Minimal enquiry (spec §20): name, phone, preferred method, optional message.
 * Context is prefilled from the listing so the buyer never retypes it.
 */
export function ContactPanel({ property: p }: { property: Property }) {
  const [mode, setMode] = useState<Mode>("enquire");
  const [method, setMethod] = useState<(typeof METHODS)[number]>("Call");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Hi, I'm interested in this ${propertyHeadline(p)} in ${p.locality}. Is it still available?`);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; slot?: string }>({});
  const [done, setDone] = useState(false);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d;
      }),
    [],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Please enter your name";
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10))) next.phone = "Enter a valid 10-digit mobile number";
    if (mode === "visit" && !slot) next.slot = "Pick a time slot";
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true);
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-35px_rgb(11_17_32/0.45)] ring-1 ring-ink-900/[0.06]">
      <div className="border-b border-ink-900/[0.06] p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-ink-900 font-display text-lg text-brass-300">{p.seller.name.charAt(0)}</span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-900">{p.seller.name}</p>
            <p className="text-xs text-ink-600">{p.seller.type}{p.seller.certified ? " · Certified" : ""}{p.seller.responseTime ? ` · ${p.seller.responseTime}` : ""}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-sand-100 p-1">
          {(["enquire", "visit"] as Mode[]).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setDone(false); }} className={cn("relative rounded-full py-2 text-sm font-medium", mode === m ? "text-white" : "text-ink-700")}>
              {mode === m && <motion.span layoutId="contact-mode" className="absolute inset-0 rounded-full bg-ink-900" />}
              <span className="relative">{m === "enquire" ? "Contact seller" : "Schedule visit"}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center">
            <svg viewBox="0 0 52 52" className="mx-auto h-16 w-16" aria-hidden>
              <motion.circle cx="26" cy="26" r="24" fill="none" stroke="#059669" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
              <motion.path d="M15 27l7 7 15-16" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45, duration: 0.4 }} />
            </svg>
            <p className="mt-5 font-display text-2xl text-ink-900">{mode === "visit" ? "Visit requested" : "Enquiry sent"}</p>
            <p className="mt-2 text-sm text-ink-600">
              {mode === "visit"
                ? `${p.seller.name} will confirm your visit on ${days[day].toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} at ${slot}.`
                : `${p.seller.name} will reach you by ${method.toLowerCase()} shortly.`}
            </p>
            <button type="button" onClick={() => setDone(false)} className="mt-6 text-sm font-semibold text-brass-700 hover:underline">Send another</button>
          </motion.div>
        ) : (
          <motion.form key={mode} onSubmit={submit} noValidate initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }} className="space-y-4 p-5">
            {mode === "visit" && (
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-sm font-medium text-ink-900"><CalendarDays className="h-4 w-4" /> Pick a day</p>
                <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
                  {days.map((d, i) => (
                    <button key={d.toISOString()} type="button" onClick={() => setDay(i)} className={cn("flex w-14 shrink-0 flex-col items-center rounded-2xl border py-2 transition", day === i ? "border-ink-900 bg-ink-900 text-white" : "border-ink-900/10 hover:border-ink-900/40")}>
                      <span className="text-[10px] uppercase tracking-wider opacity-70">{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                      <span className="text-lg font-semibold">{d.getDate()}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SLOTS.map((s) => (
                    <button key={s} type="button" onClick={() => setSlot(s)} className={cn("rounded-xl border py-2 text-xs font-medium transition", slot === s ? "border-brass-600 bg-brass-100 text-ink-900" : "border-ink-900/10 hover:border-ink-900/40")}>
                      {s}
                    </button>
                  ))}
                </div>
                {errors.slot && <p className="text-xs text-rose-600">{errors.slot}</p>}
              </div>
            )}

            <Field label="Your name" error={errors.name}>
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="h-12 w-full rounded-xl border border-ink-900/12 bg-sand-50 px-4 text-sm outline-none transition focus:border-ink-900 focus:bg-white" />
            </Field>
            <Field label="Mobile number" error={errors.phone}>
              <div className="flex h-12 items-center overflow-hidden rounded-xl border border-ink-900/12 bg-sand-50 transition focus-within:border-ink-900 focus-within:bg-white">
                <span className="border-r border-ink-900/10 px-3 text-sm text-ink-600">+91</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric" autoComplete="tel-national" className="h-full flex-1 bg-transparent px-3 text-sm outline-none" />
              </div>
            </Field>

            {mode === "enquire" && (
              <>
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-ink-900">Preferred contact</legend>
                  <div className="flex gap-2">
                    {METHODS.map((m) => (
                      <button key={m} type="button" aria-pressed={method === m} onClick={() => setMethod(m)} className={cn("flex-1 rounded-xl border py-2 text-xs font-medium transition", method === m ? "border-ink-900 bg-ink-900 text-white" : "border-ink-900/10 hover:border-ink-900/40")}>
                        {m}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <Field label="Message (optional)">
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full resize-none rounded-xl border border-ink-900/12 bg-sand-50 px-4 py-3 text-sm outline-none transition focus:border-ink-900 focus:bg-white" />
                </Field>
              </>
            )}

            <motion.button whileTap={{ scale: 0.98 }} type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brass-500 font-semibold text-ink-900 transition hover:bg-brass-400">
              {mode === "visit" ? <><CalendarDays className="h-4 w-4" /> Request visit</> : <><Check className="h-4 w-4" /> Send enquiry</>}
            </motion.button>
            <div className="grid grid-cols-2 gap-2">
              <a href="tel:+911414002026" className="flex items-center justify-center gap-2 rounded-xl border border-ink-900/12 py-2.5 text-sm font-medium hover:bg-sand-100"><Phone className="h-4 w-4" /> Call</a>
              <a href={`https://wa.me/911414002026?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-ink-900/12 py-2.5 text-sm font-medium hover:bg-sand-100"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            </div>
            <p className="flex items-start gap-2 text-[11px] leading-relaxed text-ink-600">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
              Your number is shared only with this seller. Never pay before visiting the property.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-900">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1 block text-xs text-rose-600">
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
