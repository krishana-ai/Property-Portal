import type { Property } from "./types";

/**
 * Indian pricing presentation (spec §72): ₹42 Lakh, ₹1.25 Cr, ₹25,000 / month.
 * Values are stored as plain rupee numbers; formatting only happens here.
 */
export function formatPrice(amount: number, { compact = false } = {}): string {
  if (amount >= 1_00_00_000) {
    const cr = trim(amount / 1_00_00_000);
    return `₹${cr} Cr`;
  }
  if (amount >= 1_00_000) {
    const l = trim(amount / 1_00_000);
    return compact ? `₹${l}L` : `₹${l} Lakh`;
  }
  if (compact && amount >= 1_000) {
    return `₹${trim(amount / 1_000)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatPropertyPrice(p: Pick<Property, "price" | "priceIsMonthly">): string {
  return p.priceIsMonthly ? `${formatPrice(p.price)} / month` : formatPrice(p.price);
}

export function pricePerSqft(p: Pick<Property, "price" | "priceIsMonthly" | "areaSqft">): string | null {
  if (p.priceIsMonthly || !p.areaSqft) return null;
  return `₹${Math.round(p.price / p.areaSqft).toLocaleString("en-IN")}/sq.ft`;
}

export function formatArea(p: Pick<Property, "areaSqft" | "originalArea">): string {
  const sqft = `${p.areaSqft.toLocaleString("en-IN")} sq.ft`;
  if (!p.originalArea) return sqft;
  // Keep the original unit first; the conversion is presented as approximate.
  return `${p.originalArea.value.toLocaleString("en-IN")} ${p.originalArea.unit} ≈ ${sqft}`;
}

export function postedLabel(days: number): string {
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 7) return `Posted ${days} days ago`;
  const weeks = Math.round(days / 7);
  return `Posted ${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

export function propertyHeadline(p: Pick<Property, "bhk" | "kind">): string {
  return p.bhk ? `${p.bhk} BHK ${p.kind}` : p.kind;
}

function trim(n: number): string {
  return n.toFixed(2).replace(/\.?0+$/, "");
}

/** "Ritika Agarwal" → "RA" (used for avatars). */
export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
}
