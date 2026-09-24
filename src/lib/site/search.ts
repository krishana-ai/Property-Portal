import { LOCALITIES, PROJECTS, PROPERTIES } from "./catalog";
import type { Intent, Property, SellerType } from "./types";

/** Transaction determines filter vocabulary (spec rule #2). */
export interface IntentConfig {
  id: Intent;
  label: string;
  noun: string;
  budgets: { label: string; value: number }[];
  showBhk: boolean;
}

export const INTENTS: IntentConfig[] = [
  {
    id: "buy", label: "Buy", noun: "Properties for sale", showBhk: true,
    budgets: [
      { label: "₹25 L", value: 2_500_000 }, { label: "₹50 L", value: 5_000_000 },
      { label: "₹75 L", value: 7_500_000 }, { label: "₹1 Cr", value: 10_000_000 },
      { label: "₹2.5 Cr", value: 25_000_000 }, { label: "₹5 Cr", value: 50_000_000 },
    ],
  },
  {
    id: "rent", label: "Rent", noun: "Homes for rent", showBhk: true,
    budgets: [
      { label: "₹10K / month", value: 10_000 }, { label: "₹15K / month", value: 15_000 },
      { label: "₹25K / month", value: 25_000 }, { label: "₹50K / month", value: 50_000 },
    ],
  },
  {
    id: "pg", label: "PG / Co-living", noun: "PGs & co-living", showBhk: false,
    budgets: [
      { label: "₹6K / month", value: 6_000 }, { label: "₹8K / month", value: 8_000 },
      { label: "₹10K / month", value: 10_000 }, { label: "₹15K / month", value: 15_000 },
    ],
  },
  {
    id: "commercial", label: "Commercial", noun: "Commercial spaces", showBhk: false,
    budgets: [
      { label: "₹50K / month", value: 50_000 }, { label: "₹1.5 Lakh / month", value: 150_000 },
      { label: "₹50 L", value: 5_000_000 }, { label: "₹1 Cr", value: 10_000_000 },
      { label: "₹5 Cr", value: 50_000_000 },
    ],
  },
  {
    id: "plots", label: "Plots / Land", noun: "Plots & land", showBhk: false,
    budgets: [
      { label: "₹25 L", value: 2_500_000 }, { label: "₹50 L", value: 5_000_000 },
      { label: "₹1 Cr", value: 10_000_000 }, { label: "₹2.5 Cr", value: 25_000_000 },
    ],
  },
];

export const getIntent = (id: string | null | undefined): IntentConfig =>
  INTENTS.find((i) => i.id === id) ?? INTENTS[0];

export type SortKey = "relevance" | "newest" | "price-asc" | "price-desc" | "area-desc";

export const SORTS: { id: SortKey; label: string }[] = [
  { id: "relevance", label: "Relevance" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "area-desc", label: "Area: High to Low" },
];

export interface SearchFilters {
  intent: Intent;
  q: string;
  localities: string[];
  bhk: number[];
  maxPrice?: number;
  sellers: SellerType[];
  verified: boolean;
  rera: boolean;
  ready: boolean;
  furnished: boolean;
  sort: SortKey;
}

export const DEFAULT_FILTERS: SearchFilters = {
  intent: "buy", q: "", localities: [], bhk: [], sellers: [],
  verified: false, rera: false, ready: false, furnished: false, sort: "relevance",
};

type ParamSource = { get(key: string): string | null };

export function parseFilters(params: ParamSource): SearchFilters {
  const list = (k: string) => (params.get(k) ?? "").split(",").filter(Boolean);
  const flag = (k: string) => params.get(k) === "1";
  const max = Number(params.get("max"));
  return {
    intent: getIntent(params.get("intent")).id,
    q: params.get("q") ?? "",
    localities: list("loc"),
    bhk: list("bhk").map(Number).filter((n) => n > 0),
    maxPrice: Number.isFinite(max) && max > 0 ? max : undefined,
    sellers: list("seller").filter((s): s is SellerType => ["Owner", "Agent", "Builder"].includes(s)),
    verified: flag("verified"),
    rera: flag("rera"),
    ready: flag("ready"),
    furnished: flag("furnished"),
    sort: (SORTS.find((s) => s.id === params.get("sort"))?.id ?? "relevance") as SortKey,
  };
}

export function filtersToQuery(f: SearchFilters): string {
  const p = new URLSearchParams();
  p.set("intent", f.intent);
  if (f.q) p.set("q", f.q);
  if (f.localities.length) p.set("loc", f.localities.join(","));
  if (f.bhk.length) p.set("bhk", f.bhk.join(","));
  if (f.maxPrice) p.set("max", String(f.maxPrice));
  if (f.sellers.length) p.set("seller", f.sellers.join(","));
  if (f.verified) p.set("verified", "1");
  if (f.rera) p.set("rera", "1");
  if (f.ready) p.set("ready", "1");
  if (f.furnished) p.set("furnished", "1");
  if (f.sort !== "relevance") p.set("sort", f.sort);
  return p.toString();
}

export function applyFilters(all: Property[], f: SearchFilters): Property[] {
  const q = f.q.trim().toLowerCase();
  const result = all.filter((p) => {
    if (p.intent !== f.intent) return false;
    if (q && !`${p.title} ${p.locality} ${p.city} ${p.project ?? ""} ${p.kind}`.toLowerCase().includes(q)) return false;
    if (f.localities.length && !f.localities.includes(p.locality)) return false;
    if (f.bhk.length && !(p.bhk && f.bhk.some((b) => (b >= 4 ? p.bhk! >= 4 : p.bhk === b)))) return false;
    if (f.maxPrice && p.price > f.maxPrice) return false;
    if (f.sellers.length && !f.sellers.includes(p.seller.type)) return false;
    if (f.verified && !p.verified) return false;
    if (f.rera && !p.rera) return false;
    if (f.ready && !["Ready to Move", "Available Now"].includes(p.availability)) return false;
    if (f.furnished && p.furnishing !== "Fully furnished") return false;
    return true;
  });

  const sorters: Record<SortKey, (a: Property, b: Property) => number> = {
    relevance: (a, b) => Number(b.verified) - Number(a.verified) || a.postedDaysAgo - b.postedDaysAgo,
    newest: (a, b) => a.postedDaysAgo - b.postedDaysAgo,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "area-desc": (a, b) => b.areaSqft - a.areaSqft,
  };
  return result.sort(sorters[f.sort]);
}

/** Count of active non-default filters — shown as "Filters (n)". */
export function activeFilterCount(f: SearchFilters): number {
  return (
    f.localities.length + f.bhk.length + f.sellers.length + (f.maxPrice ? 1 : 0) +
    [f.verified, f.rera, f.ready, f.furnished].filter(Boolean).length
  );
}

/** Grouped location suggestions (spec §6.2) — each shows enough context to disambiguate. */
export interface Suggestion {
  group: "Locality" | "Project" | "City";
  label: string;
  context: string;
  value: string;
}

export function locationSuggestions(query: string): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const localities = LOCALITIES.filter((l) => l.name.toLowerCase().includes(q)).map<Suggestion>((l) => ({
    group: "Locality", label: l.name, context: `Locality in ${l.city} · ${l.listings} listings`, value: l.name,
  }));
  const projects = PROJECTS.filter((p) => p.name.toLowerCase().includes(q)).map<Suggestion>((p) => ({
    group: "Project", label: p.name, context: `${p.developer} · ${p.locality}, ${p.city}`, value: p.name,
  }));
  const cities = "jaipur".includes(q)
    ? [{ group: "City" as const, label: "Jaipur", context: `Rajasthan · ${PROPERTIES.length}+ verified listings`, value: "Jaipur" }]
    : [];
  return [...localities, ...projects, ...cities].slice(0, 7);
}

/** Build a human search title, e.g. "2 BHK Homes for rent in Malviya Nagar, Jaipur". */
export function searchTitle(f: SearchFilters): string {
  const intent = getIntent(f.intent);
  const bhk = f.bhk.length === 1 ? `${f.bhk[0]} BHK ` : "";
  const where = f.localities.length === 1 ? `${f.localities[0]}, Jaipur` : "Jaipur";
  return `${bhk}${intent.noun} in ${where}`;
}
