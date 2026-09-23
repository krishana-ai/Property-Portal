function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const analyticsKpis = {
  totalTraffic: "1.24M",
  uniqueVisitors: "412K",
  topCity: "Mumbai",
  avgSessionTime: "4m 12s",
};

export const trafficTrend = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    date: `Aug ${day}`,
    visits: Math.round(28000 + seededRandom(day) * 8000 + i * 200),
  };
});

export const cityDistribution = [
  { city: "Mumbai", visits: 312000 },
  { city: "Bangalore", visits: 268000 },
  { city: "Delhi", visits: 214000 },
  { city: "Pune", visits: 156000 },
  { city: "Chennai", visits: 98000 },
];

export const conversionRateTrend = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    date: `Aug ${day}`,
    rate: Number((2.2 + seededRandom(day + 200) * 1.4 + i * 0.02).toFixed(2)),
  };
});
