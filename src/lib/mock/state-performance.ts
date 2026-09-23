export interface StatePerformance {
  state: string;
  propertiesSold: number;
  revenue: number;
}

export const statePerformance: StatePerformance[] = [
  { state: "Maharashtra", propertiesSold: 1840, revenue: 612000 },
  { state: "Karnataka", propertiesSold: 1520, revenue: 498000 },
  { state: "Delhi NCR", propertiesSold: 1180, revenue: 445000 },
  { state: "Telangana", propertiesSold: 940, revenue: 312000 },
  { state: "Tamil Nadu", propertiesSold: 860, revenue: 268000 },
  { state: "Haryana", propertiesSold: 720, revenue: 241000 },
  { state: "Uttar Pradesh", propertiesSold: 610, revenue: 178000 },
  { state: "Gujarat", propertiesSold: 540, revenue: 165000 },
  { state: "West Bengal", propertiesSold: 380, revenue: 96000 },
  { state: "Rajasthan", propertiesSold: 290, revenue: 71000 },
].sort((a, b) => b.revenue - a.revenue);
