export const dashboardKpis = [
  { label: "Total Listings", value: "12,480", trend: { direction: "up" as const, percent: "8.2%" } },
  { label: "Pending Approvals", value: "146", trend: { direction: "up" as const, percent: "3.1%" } },
  { label: "Active Users", value: "34,902", trend: { direction: "up" as const, percent: "5.6%" } },
  { label: "Leads Today", value: "218", trend: { direction: "down" as const, percent: "2.4%" } },
  { label: "Revenue (MTD)", value: "₹1.55 Cr", trend: { direction: "up" as const, percent: "12.9%" } },
  { label: "Flagged Listings", value: "27", trend: { direction: "down" as const, percent: "6.0%" } },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const listingsLeadsTrend = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    date: `Aug ${day}`,
    listings: Math.round(320 + seededRandom(day) * 140 + i * 3),
    leads: Math.round(180 + seededRandom(day + 100) * 100 + i * 2),
  };
});

export const revenueByPlan = [
  { plan: "Free", revenue: 4200 },
  { plan: "Featured", revenue: 38500 },
  { plan: "Premium", revenue: 96800 },
  { plan: "Top", revenue: 46700 },
];

export interface PendingListing {
  id: string;
  title: string;
  city: string;
  postedBy: string;
  price: string;
  submitted: string;
}

export const pendingModerationQueue: PendingListing[] = [
  { id: "L-2041", title: "3BHK Sea View Apartment", city: "Mumbai", postedBy: "Owner", price: "₹1.75 Cr", submitted: "2026-09-22" },
  { id: "L-2040", title: "Commercial Space, MG Road", city: "Bangalore", postedBy: "Agent", price: "₹4.5 Cr", submitted: "2026-09-22" },
  { id: "L-2039", title: "2BHK Ready to Move", city: "Pune", postedBy: "Builder", price: "₹82 L", submitted: "2026-09-21" },
  { id: "L-2038", title: "Independent Villa with Garden", city: "Chennai", postedBy: "Owner", price: "₹2.65 Cr", submitted: "2026-09-21" },
  { id: "L-2037", title: "Studio Apartment, Whitefield", city: "Bangalore", postedBy: "Agent", price: "₹52 L", submitted: "2026-09-20" },
];
