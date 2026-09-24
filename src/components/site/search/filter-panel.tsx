"use client";

import { Check } from "lucide-react";
import { LOCALITIES } from "@/lib/site/catalog";
import { getIntent, type SearchFilters } from "@/lib/site/search";
import type { SellerType } from "@/lib/site/types";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (patch: Partial<SearchFilters>) => void;
}

const SELLERS: SellerType[] = ["Owner", "Agent", "Builder"];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/** Layer 1 + Layer 3 filters (spec §9). Vocabulary adapts to the selected intent. */
export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const intent = getIntent(filters.intent);

  return (
    <div className="space-y-8">
      <FilterGroup title="Locality">
        <div className="space-y-1">
          {LOCALITIES.map((l) => {
            const checked = filters.localities.includes(l.name);
            return (
              <label key={l.slug} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm hover:bg-sand-100">
                <span className="flex items-center gap-3">
                  <span className={cn("grid h-5 w-5 place-items-center rounded-md border transition-colors", checked ? "border-ink-900 bg-ink-900 text-white" : "border-ink-900/20 bg-white")}>
                    {checked && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <input type="checkbox" className="sr-only" checked={checked} onChange={() => onChange({ localities: toggle(filters.localities, l.name) })} />
                  {l.name}
                </span>
                <span className="text-xs text-ink-600">{l.listings}</span>
              </label>
            );
          })}
        </div>
      </FilterGroup>

      {intent.showBhk && (
        <FilterGroup title="BHK">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((n) => (
              <Pill key={n} active={filters.bhk.includes(n)} onClick={() => onChange({ bhk: toggle(filters.bhk, n) })}>
                {n === 4 ? "4+ BHK" : `${n} BHK`}
              </Pill>
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title={filters.intent === "rent" || filters.intent === "pg" ? "Monthly budget" : "Budget"}>
        <div className="flex flex-wrap gap-2">
          <Pill active={!filters.maxPrice} onClick={() => onChange({ maxPrice: undefined })}>Any</Pill>
          {intent.budgets.map((b) => (
            <Pill key={b.value} active={filters.maxPrice === b.value} onClick={() => onChange({ maxPrice: b.value })}>
              ≤ {b.label.replace(" / month", "")}
            </Pill>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Posted by">
        <div className="flex flex-wrap gap-2">
          {SELLERS.map((s) => (
            <Pill key={s} active={filters.sellers.includes(s)} onClick={() => onChange({ sellers: toggle(filters.sellers, s) })}>
              {s}
            </Pill>
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-600">{title}</legend>
      {children}
    </fieldset>
  );
}

export function Pill({ active, onClick, children, className }: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-300",
        active ? "border-ink-900 bg-ink-900 text-white" : "border-ink-900/12 bg-white text-ink-700 hover:border-ink-900/40",
        className,
      )}
    >
      {children}
    </button>
  );
}
