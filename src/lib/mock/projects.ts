export type ReraStatus = "RERA Registered" | "Pending" | "Non-Compliant";

export interface ProjectPhase {
  name: string;
  totalUnits: number;
  sold: number;
  available: number;
  hold: number;
}

let nextProjectSeq = 13;
export function nextProjectId(): string {
  return `PRJ-${String(nextProjectSeq++).padStart(2, "0")}`;
}

export interface Project {
  id: string;
  name: string;
  developer: string;
  city: string;
  totalUnits: number;
  sold: number;
  available: number;
  hold: number;
  reraStatus: ReraStatus;
  phases: ProjectPhase[];
}

export const mockProjects: Project[] = [
  { id: "PRJ-01", name: "Skyline Residency", developer: "Skyline Developers", city: "Mumbai", totalUnits: 320, sold: 210, available: 90, hold: 20, reraStatus: "RERA Registered", phases: [ { name: "Phase 1", totalUnits: 160, sold: 140, available: 15, hold: 5 }, { name: "Phase 2", totalUnits: 160, sold: 70, available: 75, hold: 15 } ] },
  { id: "PRJ-02", name: "Green Valley Enclave", developer: "Green Valley Builders", city: "Bangalore", totalUnits: 480, sold: 300, available: 150, hold: 30, reraStatus: "RERA Registered", phases: [ { name: "Phase 1", totalUnits: 240, sold: 200, available: 30, hold: 10 }, { name: "Phase 2", totalUnits: 240, sold: 100, available: 120, hold: 20 } ] },
  { id: "PRJ-03", name: "Horizon Business Park", developer: "Horizon Realty", city: "Gurugram", totalUnits: 150, sold: 60, available: 80, hold: 10, reraStatus: "Pending", phases: [ { name: "Phase 1", totalUnits: 150, sold: 60, available: 80, hold: 10 } ] },
  { id: "PRJ-04", name: "Lakeview Towers", developer: "Skyline Developers", city: "Pune", totalUnits: 260, sold: 240, available: 10, hold: 10, reraStatus: "RERA Registered", phases: [ { name: "Phase 1", totalUnits: 130, sold: 128, available: 0, hold: 2 }, { name: "Phase 2", totalUnits: 130, sold: 112, available: 10, hold: 8 } ] },
  { id: "PRJ-05", name: "Palm Meadows", developer: "Coastal Homes", city: "Chennai", totalUnits: 96, sold: 40, available: 50, hold: 6, reraStatus: "RERA Registered", phases: [ { name: "Phase 1", totalUnits: 96, sold: 40, available: 50, hold: 6 } ] },
  { id: "PRJ-06", name: "Cyber Heights", developer: "Horizon Realty", city: "Gurugram", totalUnits: 400, sold: 180, available: 190, hold: 30, reraStatus: "Non-Compliant", phases: [ { name: "Phase 1", totalUnits: 200, sold: 120, available: 70, hold: 10 }, { name: "Phase 2", totalUnits: 200, sold: 60, available: 120, hold: 20 } ] },
  { id: "PRJ-07", name: "Riverside Greens", developer: "Green Valley Builders", city: "Bangalore", totalUnits: 210, sold: 90, available: 100, hold: 20, reraStatus: "RERA Registered", phases: [ { name: "Phase 1", totalUnits: 210, sold: 90, available: 100, hold: 20 } ] },
  { id: "PRJ-08", name: "Sunset Boulevard", developer: "Coastal Homes", city: "Chennai", totalUnits: 140, sold: 55, available: 75, hold: 10, reraStatus: "Pending", phases: [ { name: "Phase 1", totalUnits: 140, sold: 55, available: 75, hold: 10 } ] },
  { id: "PRJ-09", name: "Township Greens", developer: "Skyline Developers", city: "Mumbai", totalUnits: 620, sold: 410, available: 170, hold: 40, reraStatus: "RERA Registered", phases: [ { name: "Phase 1", totalUnits: 310, sold: 280, available: 20, hold: 10 }, { name: "Phase 2", totalUnits: 310, sold: 130, available: 150, hold: 30 } ] },
  { id: "PRJ-10", name: "Emerald Court", developer: "Green Valley Builders", city: "Pune", totalUnits: 180, sold: 70, available: 95, hold: 15, reraStatus: "RERA Registered", phases: [ { name: "Phase 1", totalUnits: 180, sold: 70, available: 95, hold: 15 } ] },
  { id: "PRJ-11", name: "Metro Square", developer: "Horizon Realty", city: "Delhi", totalUnits: 260, sold: 100, available: 140, hold: 20, reraStatus: "Non-Compliant", phases: [ { name: "Phase 1", totalUnits: 260, sold: 100, available: 140, hold: 20 } ] },
  { id: "PRJ-12", name: "Coastal Dunes", developer: "Coastal Homes", city: "Chennai", totalUnits: 88, sold: 30, available: 50, hold: 8, reraStatus: "RERA Registered", phases: [ { name: "Phase 1", totalUnits: 88, sold: 30, available: 50, hold: 8 } ] },
];
