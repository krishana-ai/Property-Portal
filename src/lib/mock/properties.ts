export type CanonicalStatus = "Canonical" | "Under Review" | "Duplicate Candidate";
export type PropertyType = "Apartment" | "Villa" | "Plot" | "Commercial" | "Office" | "PG";

let nextPropertySeq = 5013;
export function nextPropertyId(): string {
  return `P-${nextPropertySeq++}`;
}

export interface LinkedListing {
  id: string;
  title: string;
  price: string;
  postedBy: "Owner" | "Broker" | "Developer";
  status: "Approved" | "Pending" | "Rejected";
}

export interface CanonicalProperty {
  id: string;
  address: string;
  type: PropertyType;
  city: string;
  canonicalStatus: CanonicalStatus;
  linkedListings: LinkedListing[];
}

export const mockProperties: CanonicalProperty[] = [
  {
    id: "P-5001",
    address: "Sunrise Towers, Bandra West",
    type: "Apartment",
    city: "Mumbai",
    canonicalStatus: "Canonical",
    linkedListings: [
      { id: "L-2041", title: "3BHK Sea View Apartment", price: "₹1.75 Cr", postedBy: "Owner", status: "Pending" },
      { id: "L-1988", title: "3BHK Sunrise Towers Resale", price: "₹1.78 Cr", postedBy: "Broker", status: "Approved" },
    ],
  },
  {
    id: "P-5002",
    address: "MG Road Commercial Complex, Unit 4B",
    type: "Commercial",
    city: "Bangalore",
    canonicalStatus: "Canonical",
    linkedListings: [
      { id: "L-2040", title: "Commercial Space, MG Road", price: "₹4.5 Cr", postedBy: "Broker", status: "Pending" },
    ],
  },
  {
    id: "P-5003",
    address: "Hinjewadi Phase 2, Block C-12",
    type: "Apartment",
    city: "Pune",
    canonicalStatus: "Under Review",
    linkedListings: [
      { id: "L-2039", title: "2BHK Ready to Move", price: "₹82 L", postedBy: "Developer", status: "Pending" },
    ],
  },
  {
    id: "P-5004",
    address: "ECR Villa Row, Plot 14",
    type: "Villa",
    city: "Chennai",
    canonicalStatus: "Canonical",
    linkedListings: [
      { id: "L-2038", title: "Independent Villa with Garden", price: "₹2.65 Cr", postedBy: "Owner", status: "Approved" },
    ],
  },
  {
    id: "P-5005",
    address: "Whitefield Tech Residency, T3-1104",
    type: "Apartment",
    city: "Bangalore",
    canonicalStatus: "Duplicate Candidate",
    linkedListings: [
      { id: "L-2037", title: "Studio Apartment, Whitefield", price: "₹52 L", postedBy: "Broker", status: "Approved" },
      { id: "L-1990", title: "Compact Studio near ITPL", price: "₹53 L", postedBy: "Owner", status: "Pending" },
      { id: "L-1975", title: "Whitefield Studio - Ready", price: "₹51 L", postedBy: "Broker", status: "Rejected" },
    ],
  },
  {
    id: "P-5006",
    address: "Sarjapur Road Layout, Plot 88",
    type: "Plot",
    city: "Bangalore",
    canonicalStatus: "Under Review",
    linkedListings: [
      { id: "L-2036", title: "Residential Plot, Sarjapur Road", price: "₹1.2 Cr", postedBy: "Owner", status: "Rejected" },
    ],
  },
  {
    id: "P-5007",
    address: "Vasant Kunj Sky Residences, Penthouse A",
    type: "Apartment",
    city: "Delhi",
    canonicalStatus: "Canonical",
    linkedListings: [
      { id: "L-2035", title: "4BHK Penthouse", price: "₹6.5 Cr", postedBy: "Developer", status: "Approved" },
    ],
  },
  {
    id: "P-5008",
    address: "DLF Cyber City, Tower 6, Floor 8",
    type: "Office",
    city: "Gurugram",
    canonicalStatus: "Canonical",
    linkedListings: [
      { id: "L-2034", title: "Office Space, Cyber City", price: "₹3.4 Cr", postedBy: "Broker", status: "Pending" },
    ],
  },
  {
    id: "P-5009",
    address: "Kothrud Garden View, Wing B-302",
    type: "Apartment",
    city: "Pune",
    canonicalStatus: "Canonical",
    linkedListings: [
      { id: "L-2033", title: "2BHK Garden Facing Flat", price: "₹74 L", postedBy: "Owner", status: "Approved" },
    ],
  },
  {
    id: "P-5010",
    address: "ECR Farmhouse Estate, Plot 3",
    type: "Villa",
    city: "Chennai",
    canonicalStatus: "Duplicate Candidate",
    linkedListings: [
      { id: "L-2032", title: "Farmhouse with Pool", price: "₹4.1 Cr", postedBy: "Owner", status: "Rejected" },
      { id: "L-1961", title: "Pool Farmhouse, ECR Outskirts", price: "₹4.06 Cr", postedBy: "Broker", status: "Pending" },
    ],
  },
  {
    id: "P-5011",
    address: "Commercial Street Retail Row, Shop 9",
    type: "Commercial",
    city: "Bangalore",
    canonicalStatus: "Under Review",
    linkedListings: [
      { id: "L-2031", title: "Retail Shop, Commercial Street", price: "₹2.2 Cr", postedBy: "Broker", status: "Pending" },
    ],
  },
  {
    id: "P-5012",
    address: "Township Greens, Building 7, Flat 1204",
    type: "Apartment",
    city: "Mumbai",
    canonicalStatus: "Canonical",
    linkedListings: [
      { id: "L-2030", title: "3BHK Township Apartment", price: "₹2.1 Cr", postedBy: "Developer", status: "Approved" },
    ],
  },
];

export const PROPERTY_CITY_OPTIONS = Array.from(new Set(mockProperties.map((p) => p.city)));
