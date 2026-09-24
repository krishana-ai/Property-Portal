"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, LayoutGrid, Map as MapIcon, SearchX, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PROPERTIES } from "@/lib/site/catalog";
import {
  activeFilterCount, applyFilters, DEFAULT_FILTERS, filtersToQuery, getIntent, INTENTS,
  parseFilters, searchTitle, SORTS, type SearchFilters, type SortKey,
} from "@/lib/site/search";
import { cn } from "@/lib/utils";
import { useLenis } from "../layout/smooth-scroll";
import { EASE_OUT } from "../motion/reveal";
import { PropertyCard } from "../property/property-card";
import { FilterPanel, Pill } from "./filter-panel";
import { ResultsMap } from "./results-map";

type QuickKey = "verified" | "rera" | "ready" | "furnished";
const QUICK: { key: QuickKey | "owner"; label: string }[] = [
  { key: "owner", label: "Owner only" },
  { key: "verified", label: "Verified" },
  { key: "rera", label: "RERA" },
  { key: "ready", label: "Ready to move" },
  { key: "furnished", label: "Furnished" },
];

export function SearchView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const lenis = useLenis();

  // URL is the single source of truth — filters, sort and intent survive back/forward (spec §10 rule 3).
  const filters = useMemo(() => parseFilters(params), [params]);
  const results = useMemo(() => applyFilters(PROPERTIES, filters), [filters]);
  const intent = getIntent(filters.intent);
  const count = activeFilterCount(filters);

  const [view, setView] = useState<"list" | "map">("list");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (sheetOpen) lenis?.stop();
    else lenis?.start();
  }, [sheetOpen, lenis]);

  function update(patch: Partial<SearchFilters>) {
    const next = { ...filters, ...patch };
    router.replace(`${pathname}?${filtersToQuery(next)}`, { scroll: false });
  }

  function quickActive(key: QuickKey | "owner") {
    return key === "owner" ? filters.sellers.length === 1 && filters.sellers[0] === "Owner" : filters[key];
  }
  function quickPatch(key: QuickKey | "owner"): Partial<SearchFilters> {
    if (key === "owner") return { sellers: quickActive("owner") ? [] : ["Owner"] };
    return { [key]: !filters[key] };
  }

  // Applied filter chips, each independently removable (spec §6.3).
  const chips: { label: string; remove: Partial<SearchFilters> }[] = [
    ...(filters.q ? [{ label: `“${filters.q}”`, remove: { q: "" } }] : []),
    ...filters.localities.map((l) => ({ label: l, remove: { localities: filters.localities.filter((x) => x !== l) } })),
    ...filters.bhk.map((b) => ({ label: b >= 4 ? "4+ BHK" : `${b} BHK`, remove: { bhk: filters.bhk.filter((x) => x !== b) } })),
    ...(filters.maxPrice ? [{ label: `≤ ${intent.budgets.find((b) => b.value === filters.maxPrice)?.label ?? filters.maxPrice}`, remove: { maxPrice: undefined } }] : []),
    ...filters.sellers.map((s) => ({ label: s, remove: { sellers: filters.sellers.filter((x) => x !== s) } })),
    ...(["verified", "rera", "ready", "furnished"] as QuickKey[])
      .filter((k) => filters[k])
      .map((k) => ({ label: QUICK.find((q) => q.key === k)!.label, remove: { [k]: false } })),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-28 sm:px-6 lg:px-8 lg:pb-24">
      {/* Intent switcher */}
      <div role="tablist" aria-label="Transaction" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
        {INTENTS.map((i) => (
          <button
            key={i.id}
            role="tab"
            aria-selected={filters.intent === i.id}
            onClick={() => update({ ...DEFAULT_FILTERS, intent: i.id, localities: filters.localities })}
            className={cn("relative shrink-0 rounded-full px-4 py-2 text-sm font-medium", filters.intent === i.id ? "text-white" : "text-ink-700 hover:bg-ink-900/5")}
          >
            {filters.intent === i.id && <motion.span layoutId="search-intent" className="absolute inset-0 rounded-full bg-ink-900" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className="relative">{i.label}</span>
          </button>
        ))}
      </div>

      {/* Results header */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <motion.h1 key={searchTitle(filters)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }} className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight text-ink-900">
            {searchTitle(filters)}
          </motion.h1>
          <p className="mt-2 text-sm text-ink-600" aria-live="polite">
            <span className="font-semibold text-ink-900">{results.length}</span> {results.length === 1 ? "property" : "properties"} found · Updated today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setSheetOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-white px-4 py-2.5 text-sm font-medium lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters{count > 0 && ` (${count})`}
          </button>
          <label className="relative">
            <span className="sr-only">Sort by</span>
            <select value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortKey })} className="h-11 appearance-none rounded-full border border-ink-900/15 bg-white pl-4 pr-10 text-sm font-medium outline-none">
              {SORTS.map((s) => <option key={s.id} value={s.id}>Sort: {s.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
          </label>
          <div className="flex rounded-full border border-ink-900/15 bg-white p-1">
            {(["list", "map"] as const).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={cn("relative grid h-9 w-9 place-items-center rounded-full", view === v ? "text-white" : "text-ink-700")} aria-label={v === "list" ? "List view" : "Map view"}>
                {view === v && <motion.span layoutId="view-toggle" className="absolute inset-0 rounded-full bg-ink-900" />}
                {v === "list" ? <LayoutGrid className="relative h-4 w-4" /> : <MapIcon className="relative h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layer 2 quick chips, each showing its result impact (spec §10 rule 4) */}
      <div className="no-scrollbar -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-1">
        {QUICK.map((q) => {
          const active = quickActive(q.key);
          const impact = active ? null : applyFilters(PROPERTIES, { ...filters, ...quickPatch(q.key) }).length;
          return (
            <Pill key={q.key} active={Boolean(active)} onClick={() => update(quickPatch(q.key))} className="shrink-0">
              {q.label}
              {impact !== null && <span className="ml-1.5 text-xs opacity-60">{impact}</span>}
            </Pill>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {chips.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 pt-4">
              <AnimatePresence mode="popLayout">
                {chips.map((c) => (
                  <motion.button
                    layout
                    key={c.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={() => update(c.remove)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brass-100 px-3 py-1.5 text-sm font-medium text-ink-900 hover:bg-brass-200"
                    aria-label={`Remove filter ${c.label}`}
                  >
                    {c.label} <X className="h-3.5 w-3.5" />
                  </motion.button>
                ))}
              </AnimatePresence>
              <button type="button" onClick={() => update({ ...DEFAULT_FILTERS, intent: filters.intent, sort: filters.sort })} className="px-2 text-sm font-medium text-ink-600 underline-offset-4 hover:text-ink-900 hover:underline">
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-24 rounded-3xl bg-white p-6 ring-1 ring-ink-900/[0.06]">
            <FilterPanel filters={filters} onChange={update} />
          </div>
        </aside>

        <div className={cn("grid gap-6", view === "map" && "xl:grid-cols-[1fr_1fr]")}>
          {view === "map" && (
            <div className="xl:order-2">
              <ResultsMap properties={results} activeSlug={activeSlug} onActive={setActiveSlug} className="h-[60vh] xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)]" />
            </div>
          )}

          {results.length === 0 ? (
            <EmptyResults filters={filters} onChange={update} />
          ) : (
            <motion.div layout className={cn("grid gap-6", view === "list" ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-1")}>
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => (
                  <motion.div
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i * 0.05, 0.4), duration: 0.6, ease: EASE_OUT } }}
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                  >
                    <PropertyCard property={p} layout={view === "map" ? "row" : "grid"} active={activeSlug === p.slug} onHover={setActiveSlug} priority={i < 3} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile full-screen filter sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink-950/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheetOpen(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 top-12 z-50 flex flex-col rounded-t-[28px] bg-sand-50 lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ink-900/10 px-5 py-4">
                <p className="font-semibold">Filters{count > 0 && ` (${count})`}</p>
                <button type="button" aria-label="Close filters" onClick={() => setSheetOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink-900/5">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div data-lenis-prevent className="flex-1 overflow-y-auto px-5 py-6">
                <FilterPanel filters={filters} onChange={update} />
              </div>
              <div className="flex gap-3 border-t border-ink-900/10 p-4">
                <button type="button" onClick={() => update({ ...DEFAULT_FILTERS, intent: filters.intent })} className="flex-1 rounded-full border border-ink-900/15 py-3.5 text-sm font-medium">
                  Reset
                </button>
                <button type="button" onClick={() => setSheetOpen(false)} className="flex-[2] rounded-full bg-ink-900 py-3.5 text-sm font-semibold text-white">
                  Show {results.length} {results.length === 1 ? "property" : "properties"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Empty state that suggests concrete next steps (spec §57). */
function EmptyResults({ filters, onChange }: { filters: SearchFilters; onChange: (p: Partial<SearchFilters>) => void }) {
  const suggestions: { label: string; patch: Partial<SearchFilters> }[] = [];
  if (filters.maxPrice) suggestions.push({ label: "Remove budget limit", patch: { maxPrice: undefined } });
  if (filters.localities.length) suggestions.push({ label: "Search all of Jaipur", patch: { localities: [] } });
  if (filters.bhk.length) suggestions.push({ label: "Any BHK", patch: { bhk: [] } });
  if (filters.sellers.length) suggestions.push({ label: "Any seller type", patch: { sellers: [] } });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-full rounded-3xl bg-white p-10 text-center ring-1 ring-ink-900/[0.06] sm:p-16">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brass-100 text-brass-700">
        <SearchX className="h-7 w-7" />
      </span>
      <h2 className="mt-6 font-display text-3xl text-ink-900">No exact matches found</h2>
      <p className="mx-auto mt-3 max-w-md text-ink-600">Try widening your search — increasing the budget, expanding the location or removing one filter usually helps.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button key={s.label} type="button" onClick={() => onChange(s.patch)} className="rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800">
            {s.label}
          </button>
        ))}
        <button type="button" onClick={() => onChange({ ...DEFAULT_FILTERS, intent: filters.intent })} className="rounded-full border border-ink-900/15 px-4 py-2 text-sm font-medium">
          Clear all filters
        </button>
      </div>
    </motion.div>
  );
}
