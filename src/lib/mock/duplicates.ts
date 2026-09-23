export interface DuplicateSide {
  id: string;
  address: string;
  price: string;
  postedBy: string;
}

export interface DuplicatePair {
  id: string;
  confidence: number;
  propertyA: DuplicateSide;
  propertyB: DuplicateSide;
}

export const mockDuplicates: DuplicatePair[] = [
  { id: "DUP-01", confidence: 96, propertyA: { id: "L-2037", address: "Studio Apartment, Whitefield, Bangalore", price: "₹52 L", postedBy: "Broker" }, propertyB: { id: "L-1990", address: "Compact Studio near ITPL, Whitefield", price: "₹53 L", postedBy: "Owner" } },
  { id: "DUP-02", confidence: 91, propertyA: { id: "L-1975", address: "Whitefield Studio - Ready to Move", price: "₹51 L", postedBy: "Broker" }, propertyB: { id: "L-2037", address: "Studio Apartment, Whitefield, Bangalore", price: "₹52 L", postedBy: "Broker" } },
  { id: "DUP-03", confidence: 88, propertyA: { id: "L-2032", address: "Farmhouse with Pool, ECR Outskirts, Chennai", price: "₹4.1 Cr", postedBy: "Owner" }, propertyB: { id: "L-1961", address: "Pool Farmhouse, ECR Outskirts", price: "₹4.06 Cr", postedBy: "Broker" } },
  { id: "DUP-04", confidence: 84, propertyA: { id: "L-2041", address: "3BHK Sea View Apartment, Bandra West", price: "₹1.75 Cr", postedBy: "Owner" }, propertyB: { id: "L-1988", address: "3BHK Sunrise Towers Resale, Bandra West", price: "₹1.78 Cr", postedBy: "Broker" } },
  { id: "DUP-05", confidence: 79, propertyA: { id: "L-2018", address: "2BHK Kothrud Garden View, Pune", price: "₹73 L", postedBy: "Owner" }, propertyB: { id: "L-2033", address: "2BHK Garden Facing Flat, Kothrud", price: "₹74 L", postedBy: "Owner" } },
  { id: "DUP-06", confidence: 74, propertyA: { id: "L-1942", address: "Retail Shop near Commercial Street, Bangalore", price: "₹2.16 Cr", postedBy: "Broker" }, propertyB: { id: "L-2031", address: "Retail Shop, Commercial Street", price: "₹2.2 Cr", postedBy: "Broker" } },
  { id: "DUP-07", confidence: 70, propertyA: { id: "L-2003", address: "Office Space near Cyber City, Gurugram", price: "₹3.36 Cr", postedBy: "Broker" }, propertyB: { id: "L-2034", address: "Office Space, Cyber City, Gurugram", price: "₹3.4 Cr", postedBy: "Broker" } },
  { id: "DUP-08", confidence: 68, propertyA: { id: "L-1899", address: "Residential Plot near Sarjapur Road", price: "₹1.18 Cr", postedBy: "Owner" }, propertyB: { id: "L-2036", address: "Residential Plot, Sarjapur Road", price: "₹1.2 Cr", postedBy: "Owner" } },
  { id: "DUP-09", confidence: 65, propertyA: { id: "L-2009", address: "4BHK Penthouse, Vasant Kunj", price: "₹6.43 Cr", postedBy: "Developer" }, propertyB: { id: "L-2035", address: "4BHK Penthouse, Vasant Kunj", price: "₹6.5 Cr", postedBy: "Developer" } },
  { id: "DUP-10", confidence: 61, propertyA: { id: "L-1877", address: "3BHK Township Apartment, Mumbai", price: "₹2.08 Cr", postedBy: "Developer" }, propertyB: { id: "L-2030", address: "3BHK Township Apartment, Mumbai", price: "₹2.1 Cr", postedBy: "Developer" } },
];
