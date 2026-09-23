export type AreaUnit = "Sq.ft" | "Gaj" | "Sq.m" | "Acre" | "Bigha";
export type TownshipStatus = "Active" | "Under Development" | "Completed";

export interface SubProject {
  name: string;
  unit: AreaUnit;
  minArea: number;
  maxArea: number;
}

let nextTownshipSeq = 11;
export function nextTownshipId(): string {
  return `TS-${String(nextTownshipSeq++).padStart(2, "0")}`;
}

export interface Township {
  id: string;
  name: string;
  location: string;
  totalArea: string;
  status: TownshipStatus;
  subProjects: SubProject[];
}

export const mockTownships: Township[] = [
  { id: "TS-01", name: "Anavrin Green City", location: "Sarjapur Road, Bangalore", totalArea: "120 Acres", status: "Active", subProjects: [ { name: "Sunrise Enclave", unit: "Sq.ft", minArea: 900, maxArea: 2400 }, { name: "Willow Court", unit: "Gaj", minArea: 100, maxArea: 250 } ] },
  { id: "TS-02", name: "Riverfront Meadows", location: "ECR, Chennai", totalArea: "85 Acres", status: "Under Development", subProjects: [ { name: "Palm Villas", unit: "Sq.m", minArea: 200, maxArea: 450 } ] },
  { id: "TS-03", name: "Metro Heights Township", location: "Sector 89, Gurugram", totalArea: "60 Acres", status: "Active", subProjects: [ { name: "Cyber Residences", unit: "Sq.ft", minArea: 750, maxArea: 1800 }, { name: "Business Tower", unit: "Sq.ft", minArea: 500, maxArea: 5000 } ] },
  { id: "TS-04", name: "Emerald Hills", location: "Hinjewadi, Pune", totalArea: "45 Acres", status: "Completed", subProjects: [ { name: "Hilltop Residency", unit: "Sq.ft", minArea: 850, maxArea: 2100 } ] },
  { id: "TS-05", name: "Golden Orchard", location: "Whitefield, Bangalore", totalArea: "30 Acres", status: "Active", subProjects: [ { name: "Orchard Homes", unit: "Bigha", minArea: 1, maxArea: 4 } ] },
  { id: "TS-06", name: "Coastal Bay Township", location: "OMR, Chennai", totalArea: "95 Acres", status: "Under Development", subProjects: [ { name: "Bay View Villas", unit: "Sq.m", minArea: 180, maxArea: 400 }, { name: "Marina Residences", unit: "Sq.ft", minArea: 950, maxArea: 2600 } ] },
  { id: "TS-07", name: "Silver Pines", location: "Whitefield, Bangalore", totalArea: "25 Acres", status: "Completed", subProjects: [ { name: "Pinewood Court", unit: "Gaj", minArea: 90, maxArea: 220 } ] },
  { id: "TS-08", name: "Sunrise Meadows", location: "Wagholi, Pune", totalArea: "55 Acres", status: "Active", subProjects: [ { name: "Meadow Residency", unit: "Sq.ft", minArea: 700, maxArea: 1650 } ] },
  { id: "TS-09", name: "Heritage Enclave", location: "Vasant Kunj, Delhi", totalArea: "40 Acres", status: "Active", subProjects: [ { name: "Heritage Towers", unit: "Sq.ft", minArea: 1200, maxArea: 3800 } ] },
  { id: "TS-10", name: "Palm Grove Estates", location: "Kondapur, Hyderabad", totalArea: "70 Acres", status: "Under Development", subProjects: [ { name: "Grove Villas", unit: "Acre", minArea: 0.1, maxArea: 0.3 } ] },
];

export interface ConversionRate {
  unit: AreaUnit;
  sqftEquivalent: number;
}

export const initialConversionRates: ConversionRate[] = [
  { unit: "Sq.ft", sqftEquivalent: 1 },
  { unit: "Gaj", sqftEquivalent: 9 },
  { unit: "Sq.m", sqftEquivalent: 10.7639 },
  { unit: "Acre", sqftEquivalent: 43560 },
  { unit: "Bigha", sqftEquivalent: 27000 },
];

export function toSqft(value: number, unit: AreaUnit): number {
  const rate = initialConversionRates.find((r) => r.unit === unit)?.sqftEquivalent ?? 1;
  return value * rate;
}
