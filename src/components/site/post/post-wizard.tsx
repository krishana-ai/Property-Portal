"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft, ArrowRight, Briefcase, Building2, Check, Clock, HardHat, Home, ImagePlus, KeyRound,
  LandPlot, Store, Trash2, User, Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { LOCALITIES } from "@/lib/site/catalog";
import { BRAND } from "@/lib/site/content";
import { blurProps, IMG } from "@/lib/site/images";
import { formatPrice } from "@/lib/site/format";
import type { Intent, Property, PropertyKind, SellerType } from "@/lib/site/types";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "../motion/reveal";
import { PropertyCard } from "../property/property-card";

type Transaction = "sell" | "rent" | "pg";
type Unit = "sq.ft" | "sq.yd" | "acre";

interface Draft {
  role?: SellerType;
  transaction?: Transaction;
  kind?: PropertyKind;
  locality?: string;
  society: string;
  bhk?: number;
  baths?: number;
  area: string;
  unit: Unit;
  furnishing?: "Unfurnished" | "Semi-furnished" | "Fully furnished";
  pgFor?: "Male" | "Female" | "Any";
  price: string;
  deposit: string;
  title: string;
  photos: { id: string; url: string }[];
}

const EMPTY: Draft = { society: "", area: "", unit: "sq.ft", price: "", deposit: "", title: "", photos: [] };
const DRAFT_KEY = "anavrin:post-draft";
const STEPS = ["You", "Transaction", "Type", "Location", "Details", "Price", "Photos", "Preview"] as const;
const MAX_PHOTOS = 15;
const TO_SQFT: Record<Unit, number> = { "sq.ft": 1, "sq.yd": 9, acre: 43_560 };

const KINDS: Record<Transaction, { kind: PropertyKind; icon: typeof Home; group: string }[]> = {
  sell: [
    { kind: "Apartment", icon: Building2, group: "Residential" },
    { kind: "Villa", icon: Home, group: "Residential" },
    { kind: "Independent House", icon: Home, group: "Residential" },
    { kind: "Builder Floor", icon: Building2, group: "Residential" },
    { kind: "Plot", icon: LandPlot, group: "Land" },
    { kind: "Office", icon: Briefcase, group: "Commercial" },
    { kind: "Shop", icon: Store, group: "Commercial" },
  ],
  rent: [
    { kind: "Apartment", icon: Building2, group: "Residential" },
    { kind: "Independent House", icon: Home, group: "Residential" },
    { kind: "Builder Floor", icon: Building2, group: "Residential" },
    { kind: "Office", icon: Briefcase, group: "Commercial" },
    { kind: "Shop", icon: Store, group: "Commercial" },
  ],
  pg: [{ kind: "PG", icon: Users, group: "PG / Co-living" }],
};

const isResidential = (k?: PropertyKind) => !!k && ["Apartment", "Villa", "Independent House", "Builder Floor"].includes(k);

export function PostWizard() {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [published, setPublished] = useState(false);
  const [restored, setRestored] = useState(false);

  // Auto-save draft (photos are object URLs, so they are not persisted).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        setDraft({ ...EMPTY, ...JSON.parse(raw), photos: [] });
        setRestored(true);
      }
    } catch {
      /* ignore corrupt draft */
    }
  }, []);
  useEffect(() => {
    try {
      const { photos: _photos, ...rest } = draft;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    } catch {
      /* storage unavailable */
    }
  }, [draft]);

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const canNext = [
    !!draft.role,
    !!draft.transaction,
    !!draft.kind,
    !!draft.locality,
    Number(draft.area) > 0 && (!isResidential(draft.kind) || !!draft.bhk) && (draft.kind !== "PG" || !!draft.pgFor),
    Number(draft.price) > 0,
    true,
    true,
  ][step];

  const completeness = useMemo(() => {
    const checks = [
      { label: "Seller & transaction", ok: !!draft.role && !!draft.transaction },
      { label: "Location", ok: !!draft.locality },
      { label: "Property details", ok: Number(draft.area) > 0 },
      { label: "Price", ok: Number(draft.price) > 0 },
      { label: "Society / project name", ok: draft.society.trim().length > 1 },
      { label: "At least 5 photos", ok: draft.photos.length >= 5 },
      { label: "Furnishing", ok: !!draft.furnishing || draft.kind === "Plot" },
    ];
    return { checks, pct: Math.round((checks.filter((c) => c.ok).length / checks.length) * 100) };
  }, [draft]);

  function go(delta: number) {
    setDir(delta);
    setStep((s) => Math.min(STEPS.length - 1, Math.max(0, s + delta)));
  }

  function publish() {
    setPublished(true);
    localStorage.removeItem(DRAFT_KEY);
  }

  if (published) return <Published />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="rounded-[32px] bg-white p-6 ring-1 ring-ink-900/[0.06] sm:p-10">
        {/* Step indicator */}
        <div className="flex items-center justify-between text-xs font-medium text-ink-600">
          <span>Step {step + 1} of {STEPS.length} · <span className="text-ink-900">{STEPS[step]}</span></span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Draft saved automatically</span>
        </div>
        <div className="mt-3 flex gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-ink-900/10">
              <motion.div className="h-full bg-brass-500" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.5, ease: EASE_OUT }} />
            </div>
          ))}
        </div>

        {restored && step === 0 && (
          <p className="mt-5 rounded-xl bg-sky-50 px-4 py-2.5 text-sm text-sky-800">We restored your unfinished listing. Photos need to be added again.</p>
        )}

        <div className="relative mt-8 min-h-[380px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              {step === 0 && (
                <StepShell title="Who are you?" hint="This changes the fields we ask for later.">
                  <ChoiceGrid
                    value={draft.role}
                    onChange={(role) => set({ role, transaction: undefined, kind: undefined })}
                    options={[
                      { value: "Owner", label: "Owner", desc: "I own this property", icon: User },
                      { value: "Agent", label: "Agent", desc: "I list on behalf of owners", icon: KeyRound },
                      { value: "Builder", label: "Builder / Developer", desc: "I'm selling project inventory", icon: HardHat },
                    ]}
                  />
                </StepShell>
              )}
              {step === 1 && (
                <StepShell title="What do you want to do?">
                  <ChoiceGrid
                    value={draft.transaction}
                    onChange={(transaction) => set({ transaction, kind: transaction === "pg" ? "PG" : undefined })}
                    options={[
                      { value: "sell", label: "Sell", desc: "Find a buyer", icon: Home },
                      { value: "rent", label: "Rent / Lease", desc: "Find a tenant", icon: KeyRound },
                      ...(draft.role !== "Builder" ? [{ value: "pg" as const, label: "PG / Co-living", desc: "Rent out beds or rooms", icon: Users }] : []),
                    ]}
                  />
                  {draft.role === "Builder" && (
                    <p className="mt-4 text-sm text-ink-600">Listing a whole project? <a href={`mailto:${BRAND.email}?subject=Builder%20project%20listing`} className="font-semibold text-brass-700 hover:underline">Talk to our builder team →</a></p>
                  )}
                </StepShell>
              )}
              {step === 2 && draft.transaction && (
                <StepShell title="Property type">
                  <ChoiceGrid
                    value={draft.kind}
                    onChange={(kind) => set({ kind, bhk: undefined, unit: kind === "Plot" ? "sq.yd" : "sq.ft" })}
                    options={KINDS[draft.transaction].map((k) => ({ value: k.kind, label: k.kind, desc: k.group, icon: k.icon }))}
                  />
                </StepShell>
              )}
              {step === 3 && (
                <StepShell title="Where is it?" hint="We show an approximate location publicly — never your exact door.">
                  <div className="grid gap-5">
                    <Input label="City" value="Jaipur" disabled />
                    <div>
                      <p className="mb-2 text-sm font-medium text-ink-900">Locality</p>
                      <div className="flex flex-wrap gap-2">
                        {LOCALITIES.map((l) => (
                          <Chip key={l.slug} active={draft.locality === l.name} onClick={() => set({ locality: l.name })}>{l.name}</Chip>
                        ))}
                      </div>
                    </div>
                    <Input label="Society / project name (optional)" value={draft.society} onChange={(v) => set({ society: v })} placeholder="e.g. Aravali Heights" />
                  </div>
                </StepShell>
              )}
              {step === 4 && (
                <StepShell title="Tell us about the property">
                  <div className="grid gap-6">
                    {isResidential(draft.kind) && (
                      <>
                        <Counter label="Bedrooms (BHK)" value={draft.bhk} onChange={(bhk) => set({ bhk })} />
                        <Counter label="Bathrooms" value={draft.baths} onChange={(baths) => set({ baths })} />
                      </>
                    )}
                    {draft.kind === "PG" && (
                      <div>
                        <p className="mb-2 text-sm font-medium text-ink-900">PG is for</p>
                        <div className="flex gap-2">
                          {(["Female", "Male", "Any"] as const).map((g) => <Chip key={g} active={draft.pgFor === g} onClick={() => set({ pgFor: g })}>{g === "Any" ? "Anyone" : g}</Chip>)}
                        </div>
                      </div>
                    )}
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <Input label={draft.kind === "Plot" ? "Plot area" : draft.kind === "PG" ? "Room size" : "Built-up area"} value={draft.area} onChange={(v) => set({ area: v.replace(/[^\d.]/g, "") })} inputMode="decimal" />
                      {draft.kind === "Plot" && (
                        <div>
                          <p className="mb-2 text-sm font-medium text-ink-900">Unit</p>
                          <div className="flex gap-2">{(["sq.yd", "sq.ft", "acre"] as Unit[]).map((u) => <Chip key={u} active={draft.unit === u} onClick={() => set({ unit: u })}>{u}</Chip>)}</div>
                        </div>
                      )}
                    </div>
                    {draft.kind === "Plot" && draft.unit !== "sq.ft" && Number(draft.area) > 0 && (
                      <p className="-mt-3 text-sm text-ink-600">≈ {(Number(draft.area) * TO_SQFT[draft.unit]).toLocaleString("en-IN")} sq.ft — we keep your original unit on the listing.</p>
                    )}
                    {draft.kind !== "Plot" && (
                      <div>
                        <p className="mb-2 text-sm font-medium text-ink-900">Furnishing</p>
                        <div className="flex flex-wrap gap-2">
                          {(["Unfurnished", "Semi-furnished", "Fully furnished"] as const).map((f) => <Chip key={f} active={draft.furnishing === f} onClick={() => set({ furnishing: f })}>{f}</Chip>)}
                        </div>
                      </div>
                    )}
                  </div>
                </StepShell>
              )}
              {step === 5 && <PriceStep draft={draft} set={set} />}
              {step === 6 && <PhotoStep draft={draft} set={set} />}
              {step === 7 && <PreviewStep draft={draft} set={set} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-between gap-3 border-t border-ink-900/10 pt-6">
          <button type="button" onClick={() => go(-1)} disabled={step === 0} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-900/5 disabled:opacity-0">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={() => go(1)} disabled={!canNext} className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-35">
              Continue <ArrowRight className="h-4 w-4" />
            </motion.button>
          ) : (
            <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={publish} className="inline-flex items-center gap-2 rounded-full bg-brass-500 px-7 py-3 text-sm font-semibold text-ink-900 transition hover:bg-brass-400">
              Submit for review <Check className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Non-blocking completeness guidance (spec §42) */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[28px] bg-ink-900 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Listing completeness</p>
          <div className="mt-4 flex items-center gap-4">
            <Ring pct={completeness.pct} />
            <p className="text-sm text-white/70">Complete listings get noticeably more enquiries. Nothing here blocks publishing.</p>
          </div>
          <ul className="mt-6 space-y-2.5">
            {completeness.checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2.5 text-sm">
                <motion.span animate={{ scale: c.ok ? [1, 1.3, 1] : 1 }} className={cn("grid h-5 w-5 place-items-center rounded-full", c.ok ? "bg-emerald-500 text-white" : "border border-white/25")}>
                  {c.ok && <Check className="h-3 w-3" />}
                </motion.span>
                <span className={c.ok ? "text-white" : "text-white/55"}>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function PriceStep({ draft, set }: { draft: Draft; set: (p: Partial<Draft>) => void }) {
  const monthly = draft.transaction !== "sell";
  const price = Number(draft.price);
  const sqft = Number(draft.area) * TO_SQFT[draft.unit];
  return (
    <StepShell title={monthly ? "Monthly rent" : "Expected price"} hint="Enter the full amount in rupees. We show buyers the Indian format automatically.">
      <div className="grid gap-5">
        <Input label={monthly ? "Rent per month (₹)" : "Expected price (₹)"} value={draft.price} onChange={(v) => set({ price: v.replace(/\D/g, "") })} inputMode="numeric" placeholder={monthly ? "22000" : "4200000"} />
        <AnimatePresence>
          {price > 0 && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="-mt-2 flex flex-wrap gap-x-4 text-sm text-ink-600">
              <span>Shows as <strong className="text-ink-900">{formatPrice(price)}{monthly ? " / month" : ""}</strong></span>
              {!monthly && sqft > 0 && <span>≈ ₹{Math.round(price / sqft).toLocaleString("en-IN")}/sq.ft</span>}
            </motion.div>
          )}
        </AnimatePresence>
        {monthly && <Input label="Security deposit (₹)" value={draft.deposit} onChange={(v) => set({ deposit: v.replace(/\D/g, "") })} inputMode="numeric" />}
      </div>
    </StepShell>
  );
}

function PhotoStep({ draft, set }: { draft: Draft; set: (p: Partial<Draft>) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function add(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_PHOTOS - draft.photos.length)
      .map((f) => ({ id: `${f.name}-${f.size}-${Math.random()}`, url: URL.createObjectURL(f) }));
    set({ photos: [...draft.photos, ...next] });
  }

  const remaining = Math.max(0, 5 - draft.photos.length);

  return (
    <StepShell title="Add photos" hint={remaining > 0 ? `Add ${remaining} more photo${remaining > 1 ? "s" : ""} to reach a complete listing.` : "Great — click a photo to make it the cover."}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); add(e.dataTransfer.files); }}
        className={cn("flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-12 text-center transition", dragging ? "border-brass-500 bg-brass-100" : "border-ink-900/15 bg-sand-50 hover:border-ink-900/35")}
      >
        <motion.span animate={{ y: dragging ? -6 : 0 }} className="grid h-14 w-14 place-items-center rounded-2xl bg-ink-900 text-brass-300"><ImagePlus className="h-6 w-6" /></motion.span>
        <span className="mt-4 font-semibold text-ink-900">Drag photos here or click to browse</span>
        <span className="mt-1 text-sm text-ink-600">{draft.photos.length} / {MAX_PHOTOS} photos · JPG or PNG</span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => add(e.target.files)} />

      {draft.photos.length > 0 && (
        <motion.ul layout className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
          <AnimatePresence>
            {draft.photos.map((ph, i) => (
              <motion.li key={ph.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="group relative aspect-square overflow-hidden rounded-2xl">
                <button type="button" onClick={() => set({ photos: [ph, ...draft.photos.filter((x) => x.id !== ph.id)] })} className="absolute inset-0" aria-label="Set as cover photo">
                  <Image src={ph.url} {...blurProps(ph.url)} alt="" fill unoptimized className="object-cover" />
                </button>
                {i === 0 && <span className="absolute left-2 top-2 rounded-md bg-ink-900/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brass-300">Cover</span>}
                <button type="button" onClick={() => set({ photos: draft.photos.filter((x) => x.id !== ph.id) })} aria-label="Remove photo" className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-rose-600 opacity-0 transition group-hover:opacity-100 focus:opacity-100">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </StepShell>
  );
}

function PreviewStep({ draft, set }: { draft: Draft; set: (p: Partial<Draft>) => void }) {
  const intent: Intent = draft.transaction === "pg" ? "pg" : draft.kind === "Plot" ? "plots" : ["Office", "Shop"].includes(draft.kind ?? "") ? "commercial" : draft.transaction === "rent" ? "rent" : "buy";
  const sqft = Math.round(Number(draft.area) * TO_SQFT[draft.unit]);
  const preview: Property = {
    slug: "preview",
    title: draft.title || `${draft.bhk ? `${draft.bhk} BHK ` : ""}${draft.kind} in ${draft.locality}`,
    kind: draft.kind ?? "Apartment",
    intent,
    price: Number(draft.price),
    priceIsMonthly: draft.transaction !== "sell",
    bhk: draft.bhk,
    areaSqft: sqft,
    originalArea: draft.kind === "Plot" && draft.unit !== "sq.ft" ? { value: Number(draft.area), unit: draft.unit, region: "Rajasthan" } : undefined,
    city: "Jaipur",
    locality: draft.locality ?? "Jaipur",
    map: { x: 50, y: 50 },
    availability: draft.transaction === "sell" ? "Ready to Move" : "Available Now",
    furnishing: draft.furnishing,
    seller: { type: draft.role ?? "Owner", name: "You" },
    verified: false,
    postedDaysAgo: 0,
    images: draft.photos.length ? draft.photos.map((p) => p.url) : [IMG.heroVilla],
    amenities: [],
    highlights: [],
    description: "",
    pg: draft.kind === "PG" ? { forGender: draft.pgFor ?? "Any", sharing: ["Single"], foodIncluded: false } : undefined,
  };

  return (
    <StepShell title="Preview" hint="This is how buyers will see your card in search results.">
      <Input label="Listing headline" value={draft.title} onChange={(v) => set({ title: v.slice(0, 60) })} placeholder={preview.title} />
      <div className="mt-6 max-w-sm">
        <PropertyCard property={preview} preview />
      </div>
      <p className="mt-4 text-sm text-ink-600">After you submit, our team reviews the listing — usually within a few hours — before it goes live. The <strong>Verified</strong> badge is added only after an on-site check.</p>
    </StepShell>
  );
}

function Published() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl rounded-[32px] bg-white p-10 text-center ring-1 ring-ink-900/[0.06] sm:p-14">
      <svg viewBox="0 0 52 52" className="mx-auto h-20 w-20" aria-hidden>
        <motion.circle cx="26" cy="26" r="24" fill="none" stroke="#C8A15E" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
        <motion.path d="M15 27l7 7 15-16" fill="none" stroke="#C8A15E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.4 }} />
      </svg>
      <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-600/20"><Clock className="h-3.5 w-3.5" /> Under review</span>
      <h2 className="mt-4 font-display text-3xl text-ink-900">Your listing is submitted</h2>
      <p className="mt-3 text-ink-600">We&apos;re checking the details and photos. You&apos;ll get an SMS when it&apos;s live — or a clear reason and a “Fix listing” link if something needs changing.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/account" className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">Go to my account</Link>
        <Link href="/" className="rounded-full border border-ink-900/15 px-6 py-3 text-sm font-semibold">Back to home</Link>
      </div>
    </motion.div>
  );
}

/* ─── Small building blocks ─── */

function StepShell({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">{title}</h2>
      {hint && <p className="mt-2 text-ink-600">{hint}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}

function ChoiceGrid<T extends string>({ value, onChange, options }: { value?: T; onChange: (v: T) => void; options: { value: T; label: string; desc: string; icon: typeof Home }[] }) {
  return (
    <div role="radiogroup" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <motion.button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(o.value)}
            className={cn("relative flex flex-col items-start rounded-2xl border p-5 text-left transition-colors", active ? "border-ink-900 bg-ink-900 text-white" : "border-ink-900/10 bg-sand-50 hover:border-ink-900/35")}
          >
            <o.icon className={cn("h-6 w-6", active ? "text-brass-300" : "text-brass-600")} />
            <span className="mt-4 font-semibold">{o.label}</span>
            <span className={cn("mt-0.5 text-sm", active ? "text-white/60" : "text-ink-600")}>{o.desc}</span>
            {active && (
              <motion.span layoutId="choice-check" className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-brass-500 text-ink-900">
                <Check className="h-3.5 w-3.5" />
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={cn("rounded-full border px-4 py-2 text-sm font-medium transition", active ? "border-ink-900 bg-ink-900 text-white" : "border-ink-900/12 hover:border-ink-900/40")}>
      {children}
    </button>
  );
}

function Counter({ label, value, onChange }: { label: string; value?: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-900">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => <Chip key={n} active={value === n} onClick={() => onChange(n)}>{n === 5 ? "5+" : n}</Chip>)}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, disabled, placeholder, inputMode }: { label: string; value: string; onChange?: (v: string) => void; disabled?: boolean; placeholder?: string; inputMode?: "numeric" | "decimal" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink-900">{label}</span>
      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-12 w-full rounded-xl border border-ink-900/12 bg-sand-50 px-4 text-sm outline-none transition focus:border-ink-900 focus:bg-white disabled:text-ink-600"
      />
    </label>
  );
}

function Ring({ pct }: { pct: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden>
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-white/15" />
        <motion.circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round" className="stroke-brass-400" strokeDasharray={c} animate={{ strokeDashoffset: c * (1 - pct / 100) }} transition={{ type: "spring", stiffness: 80, damping: 18 }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-bold">{pct}%</span>
    </div>
  );
}
