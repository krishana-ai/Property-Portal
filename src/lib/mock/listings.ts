export type ListingStatus = "Pending" | "Approved" | "Rejected";
export type PropertyType = "Apartment" | "Villa" | "Plot" | "Commercial" | "Office" | "PG";
export type PostedBy = "Owner" | "Agent" | "Builder";

export interface Listing {
  id: string;
  title: string;
  city: string;
  type: PropertyType;
  price: string;
  postedBy: PostedBy;
  status: ListingStatus;
  isActive: boolean;
  date: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft: number;
  description: string;
  documents: { name: string; status: "Verified" | "Pending" | "Missing" }[];
}

let nextListingSeq = 2042;
export function nextListingId(): string {
  return `L-${nextListingSeq++}`;
}

export const mockListings: Listing[] = [
  { id: "L-2041", title: "3BHK Sea View Apartment", city: "Mumbai", type: "Apartment", price: "₹1.75 Cr", postedBy: "Owner", status: "Pending", isActive: true, date: "2026-09-22", bedrooms: 3, bathrooms: 2, areaSqft: 1450, description: "Premium sea-facing apartment in Bandra West with modern amenities, covered parking, and 24/7 security.", documents: [{ name: "Sale Deed", status: "Verified" }, { name: "Property Tax Receipt", status: "Verified" }, { name: "NOC", status: "Pending" }] },
  { id: "L-2040", title: "Commercial Space, MG Road", city: "Bangalore", type: "Commercial", price: "₹4.5 Cr", postedBy: "Agent", status: "Pending", isActive: true, date: "2026-09-22", areaSqft: 3200, description: "Ground floor commercial unit on MG Road, ideal for retail or showroom, high footfall area.", documents: [{ name: "Sale Deed", status: "Verified" }, { name: "NOC", status: "Missing" }] },
  { id: "L-2039", title: "2BHK Ready to Move", city: "Pune", type: "Apartment", price: "₹82 L", postedBy: "Builder", status: "Pending", isActive: true, date: "2026-09-21", bedrooms: 2, bathrooms: 2, areaSqft: 980, description: "Newly constructed 2BHK in Hinjewadi, ready to move, close to IT parks.", documents: [{ name: "RERA Certificate", status: "Verified" }, { name: "Occupancy Certificate", status: "Verified" }] },
  { id: "L-2038", title: "Independent Villa with Garden", city: "Chennai", type: "Villa", price: "₹2.65 Cr", postedBy: "Owner", status: "Approved", isActive: true, date: "2026-09-21", bedrooms: 4, bathrooms: 3, areaSqft: 2800, description: "Spacious independent villa with private garden and 2 covered parking spots in ECR.", documents: [{ name: "Sale Deed", status: "Verified" }, { name: "Property Tax Receipt", status: "Verified" }] },
  { id: "L-2037", title: "Studio Apartment, Whitefield", city: "Bangalore", type: "Apartment", price: "₹52 L", postedBy: "Agent", status: "Approved", isActive: true, date: "2026-09-20", bedrooms: 1, bathrooms: 1, areaSqft: 540, description: "Compact studio apartment near ITPL, suitable for young professionals.", documents: [{ name: "Sale Deed", status: "Verified" }] },
  { id: "L-2036", title: "Residential Plot, Sarjapur Road", city: "Bangalore", type: "Plot", price: "₹1.2 Cr", postedBy: "Owner", status: "Rejected", isActive: false, date: "2026-09-19", areaSqft: 2400, description: "DTCP approved residential plot in a gated community layout.", documents: [{ name: "Layout Approval", status: "Missing" }, { name: "Sale Deed", status: "Pending" }] },
  { id: "L-2035", title: "4BHK Penthouse", city: "Delhi", type: "Apartment", price: "₹6.5 Cr", postedBy: "Builder", status: "Approved", isActive: true, date: "2026-09-19", bedrooms: 4, bathrooms: 4, areaSqft: 3600, description: "Luxury penthouse with private terrace and skyline views in Vasant Kunj.", documents: [{ name: "RERA Certificate", status: "Verified" }, { name: "Occupancy Certificate", status: "Verified" }] },
  { id: "L-2034", title: "Office Space, Cyber City", city: "Gurugram", type: "Office", price: "₹3.4 Cr", postedBy: "Agent", status: "Pending", isActive: true, date: "2026-09-18", areaSqft: 2200, description: "Grade-A office space with fitted cabins and conference rooms in DLF Cyber City.", documents: [{ name: "Sale Deed", status: "Verified" }, { name: "NOC", status: "Pending" }] },
  { id: "L-2033", title: "2BHK Garden Facing Flat", city: "Pune", type: "Apartment", price: "₹74 L", postedBy: "Owner", status: "Approved", isActive: true, date: "2026-09-17", bedrooms: 2, bathrooms: 2, areaSqft: 1020, description: "Well-maintained 2BHK facing the society garden in Kothrud.", documents: [{ name: "Sale Deed", status: "Verified" }] },
  { id: "L-2032", title: "Farmhouse with Pool", city: "Chennai", type: "Villa", price: "₹4.1 Cr", postedBy: "Owner", status: "Rejected", isActive: false, date: "2026-09-16", bedrooms: 5, bathrooms: 5, areaSqft: 5200, description: "Farmhouse with private pool and orchard on the outskirts of Chennai.", documents: [{ name: "Land Title", status: "Missing" }] },
  { id: "L-2031", title: "Retail Shop, Commercial Street", city: "Bangalore", type: "Commercial", price: "₹2.2 Cr", postedBy: "Agent", status: "Pending", isActive: true, date: "2026-09-15", areaSqft: 850, description: "High-visibility retail shop on Commercial Street, currently vacant.", documents: [{ name: "Sale Deed", status: "Pending" }, { name: "NOC", status: "Pending" }] },
  { id: "L-2030", title: "3BHK Township Apartment", city: "Mumbai", type: "Apartment", price: "₹2.1 Cr", postedBy: "Builder", status: "Approved", isActive: true, date: "2026-09-14", bedrooms: 3, bathrooms: 3, areaSqft: 1580, description: "Apartment inside a large integrated township with clubhouse and schools nearby.", documents: [{ name: "RERA Certificate", status: "Verified" }, { name: "Occupancy Certificate", status: "Pending" }] },
];

export const CITY_OPTIONS = Array.from(new Set(mockListings.map((l) => l.city)));
