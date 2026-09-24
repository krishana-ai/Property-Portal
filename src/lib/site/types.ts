/**
 * Public-site domain types.
 *
 * These mirror the conceptual model in the product spec (Property vs Listing,
 * numeric price/area, original + normalized units). They are intentionally
 * separate from the admin `lib/types.ts` so the consumer surface can evolve
 * independently until both are backed by the real API.
 */

/** The journey the user is on — drives filter vocabulary and card layout. */
export type Intent = "buy" | "rent" | "pg" | "commercial" | "plots";

export type PropertyKind =
  | "Apartment"
  | "Villa"
  | "Independent House"
  | "Builder Floor"
  | "Plot"
  | "Office"
  | "Shop"
  | "PG";

export type SellerType = "Owner" | "Agent" | "Builder";

export type Furnishing = "Unfurnished" | "Semi-furnished" | "Fully furnished";

export type Availability =
  | "Ready to Move"
  | "Under Construction"
  | "Available Now"
  | "Available from Nov";

export interface Seller {
  type: SellerType;
  name: string;
  /** Agent certification is a distinct trust signal from listing verification. */
  certified?: boolean;
  responseTime?: string;
}

/** Plot/land area keeps the seller's original unit alongside the normalized value. */
export interface OriginalArea {
  value: number;
  unit: "sq.yd" | "sq.m" | "acre" | "bigha";
  /** Region context, e.g. "Rajasthan" — bigha is not a national constant. */
  region?: string;
}

export interface PgDetails {
  forGender: "Male" | "Female" | "Any";
  sharing: ("Single" | "Double" | "Triple")[];
  foodIncluded: boolean;
}

export interface Property {
  slug: string;
  title: string;
  kind: PropertyKind;
  intent: Intent;
  /** INR. Monthly for rent / PG, total for sale. */
  price: number;
  priceIsMonthly: boolean;
  deposit?: number;
  bhk?: number;
  baths?: number;
  areaSqft: number;
  originalArea?: OriginalArea;
  city: string;
  locality: string;
  /** Approximate position (0–100) on the stylised city map. Never door-level. */
  map: { x: number; y: number };
  availability: Availability;
  furnishing?: Furnishing;
  floor?: string;
  facing?: string;
  ageYears?: number;
  parking?: number;
  project?: string;
  seller: Seller;
  verified: boolean;
  rera?: string;
  featured?: boolean;
  postedDaysAgo: number;
  images: string[];
  hasVideo?: boolean;
  hasFloorPlan?: boolean;
  amenities: string[];
  highlights: string[];
  description: string;
  pg?: PgDetails;
}

export interface Locality {
  slug: string;
  name: string;
  city: string;
  image: string;
  /** Average sale ₹/sq.ft for the labelled data period. */
  avgPriceSqft: number;
  /** Year-on-year change in percent. */
  yoy: number;
  rentFrom: number;
  listings: number;
  tagline: string;
}

export interface Project {
  slug: string;
  name: string;
  developer: string;
  locality: string;
  city: string;
  image: string;
  priceFrom: number;
  priceTo: number;
  configurations: string;
  status: "New Launch" | "Under Construction" | "Ready to Move" | "Upcoming";
  possession: string;
  rera: string;
  units: number;
  acres: number;
}
