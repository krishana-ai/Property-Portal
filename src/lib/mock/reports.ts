export interface FunnelStep {
  label: string;
  count: number;
}

export const conversionFunnel: FunnelStep[] = [
  { label: "Search", count: 48200 },
  { label: "View", count: 21400 },
  { label: "Contact", count: 5600 },
  { label: "Deal", count: 820 },
];

export interface RevenueRow {
  plan: string;
  city: string;
  period: string;
  revenue: number;
}

export const revenueReportRows: RevenueRow[] = [
  { plan: "Premium", city: "Mumbai", period: "Aug 2026", revenue: 42000 },
  { plan: "Featured", city: "Bangalore", period: "Aug 2026", revenue: 28500 },
  { plan: "Top", city: "Delhi", period: "Aug 2026", revenue: 19800 },
  { plan: "Premium", city: "Pune", period: "Aug 2026", revenue: 15200 },
  { plan: "Free", city: "Chennai", period: "Aug 2026", revenue: 2100 },
  { plan: "Featured", city: "Gurugram", period: "Aug 2026", revenue: 22300 },
  { plan: "Premium", city: "Mumbai", period: "Jul 2026", revenue: 38700 },
  { plan: "Top", city: "Bangalore", period: "Jul 2026", revenue: 17600 },
  { plan: "Featured", city: "Delhi", period: "Jul 2026", revenue: 20400 },
  { plan: "Premium", city: "Chennai", period: "Jul 2026", revenue: 13900 },
  { plan: "Free", city: "Pune", period: "Jul 2026", revenue: 1800 },
  { plan: "Top", city: "Gurugram", period: "Jul 2026", revenue: 16200 },
];

export const REPORT_CITY_OPTIONS = Array.from(new Set(revenueReportRows.map((r) => r.city)));
