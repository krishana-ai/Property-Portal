"use client";

import { AnimatePresence, motion } from "motion/react";
import { Building2, ChevronDown, Landmark, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState } from "react";
import { DEFAULT_FILTERS, filtersToQuery, INTENTS, locationSuggestions, type Suggestion } from "@/lib/site/search";
import type { Intent } from "@/lib/site/types";
import { cn } from "@/lib/utils";
import { Magnetic } from "../motion/magnetic";

const GROUP_ICON = { Locality: MapPin, Project: Building2, City: Landmark } as const;

const QUICK_SEARCHES: { label: string; intent: Intent; loc?: string; bhk?: number }[] = [
  { label: "2 BHK in Malviya Nagar", intent: "buy", loc: "Malviya Nagar", bhk: 2 },
  { label: "Rentals in C-Scheme", intent: "rent", loc: "C-Scheme" },
  { label: "PG near Jagatpura", intent: "pg", loc: "Jagatpura" },
  { label: "Plots on Ajmer Road", intent: "plots", loc: "Ajmer Road" },
];

export function HeroSearch() {
  const router = useRouter();
  const listId = useId();
  const [intent, setIntent] = useState<Intent>("buy");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Suggestion | null>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [bhk, setBhk] = useState<number | null>(null);
  const [budget, setBudget] = useState<number | "">("");
  const inputRef = useRef<HTMLInputElement>(null);

  const config = INTENTS.find((i) => i.id === intent)!;
  const suggestions = useMemo(() => (picked ? [] : locationSuggestions(query)), [query, picked]);

  function choose(s: Suggestion) {
    setPicked(s);
    setQuery(s.label);
    setOpen(false);
  }

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const loc = picked?.group === "Locality" ? [picked.value] : [];
    const q = picked?.group === "Project" ? picked.value : !picked && query ? query : "";
    const qs = filtersToQuery({
      ...DEFAULT_FILTERS,
      intent,
      q,
      localities: loc,
      bhk: bhk && config.showBhk ? [bhk] : [],
      maxPrice: budget || undefined,
    });
    router.push(`/search?${qs}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || !suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(suggestions[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Transaction tabs — mutually exclusive, so they read as a segmented control, not checkboxes. */}
      <div role="tablist" aria-label="What are you looking for?" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-3">
        {INTENTS.map((i) => (
          <button
            key={i.id}
            role="tab"
            type="button"
            aria-selected={intent === i.id}
            onClick={() => {
              setIntent(i.id);
              setBudget("");
            }}
            className={cn(
              "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              intent === i.id ? "text-ink-900" : "text-white/75 hover:text-white",
            )}
          >
            {intent === i.id && (
              <motion.span layoutId="hero-intent" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
            )}
            <span className="relative">{i.label}</span>
          </button>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="relative rounded-[28px] bg-white/95 p-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] ring-1 ring-white/40 backdrop-blur-xl"
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
          <div className="relative flex-1">
            <label htmlFor="hero-location" className="sr-only">City, locality or project</label>
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brass-600" />
            <input
              ref={inputRef}
              id="hero-location"
              role="combobox"
              aria-expanded={open && suggestions.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              autoComplete="off"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPicked(null);
                setOpen(true);
                setHighlight(0);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 120)}
              onKeyDown={onKeyDown}
              placeholder="Search locality, project or landmark in Jaipur"
              className="h-14 w-full rounded-[22px] bg-transparent pl-12 pr-4 text-[15px] text-ink-900 outline-none placeholder:text-ink-600/70 focus:bg-sand-100"
            />

            <AnimatePresence>
              {open && suggestions.length > 0 && (
                <motion.ul
                  id={listId}
                  role="listbox"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-ink-900/10"
                >
                  {suggestions.map((s, i) => {
                    const Icon = GROUP_ICON[s.group];
                    const showGroup = i === 0 || suggestions[i - 1].group !== s.group;
                    return (
                      <li key={`${s.group}-${s.label}`}>
                        {showGroup && (
                          <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-600">{s.group}</p>
                        )}
                        <button
                          type="button"
                          role="option"
                          aria-selected={i === highlight}
                          onMouseEnter={() => setHighlight(i)}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => choose(s)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                            i === highlight ? "bg-sand-100" : "",
                          )}
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brass-100 text-brass-700">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-ink-900">{s.label}</span>
                            <span className="block truncate text-xs text-ink-600">{s.context}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-2 md:flex">
            <AnimatePresence initial={false} mode="popLayout">
              {config.showBhk && (
                <motion.div
                  key="bhk"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="relative"
                >
                  <label htmlFor="hero-bhk" className="sr-only">BHK</label>
                  <select
                    id="hero-bhk"
                    value={bhk ?? ""}
                    onChange={(e) => setBhk(e.target.value ? Number(e.target.value) : null)}
                    className="h-14 w-full appearance-none rounded-[22px] bg-sand-100 pl-4 pr-10 text-sm font-medium text-ink-900 outline-none md:w-32"
                  >
                    <option value="">Any BHK</option>
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>{n === 4 ? "4+ BHK" : `${n} BHK`}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className={cn("relative", !config.showBhk && "col-span-2")}>
              <label htmlFor="hero-budget" className="sr-only">Budget</label>
              <select
                id="hero-budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : "")}
                className="h-14 w-full appearance-none rounded-[22px] bg-sand-100 pl-4 pr-10 text-sm font-medium text-ink-900 outline-none md:w-44"
              >
                <option value="">Any budget</option>
                {config.budgets.map((b) => (
                  <option key={b.value} value={b.value}>Up to {b.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-600" />
            </div>
          </div>

          <Magnetic strength={0.2}>
            <button
              type="submit"
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-ink-900 px-7 text-sm font-semibold text-white transition-colors hover:bg-ink-800 md:w-auto"
            >
              <Search className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              Search
            </button>
          </Magnetic>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-white/60">Popular:</span>
        {QUICK_SEARCHES.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() =>
              router.push(
                `/search?${filtersToQuery({ ...DEFAULT_FILTERS, intent: s.intent, localities: s.loc ? [s.loc] : [], bhk: s.bhk ? [s.bhk] : [] })}`,
              )
            }
            className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/85 backdrop-blur transition hover:border-white/50 hover:bg-white/15"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
