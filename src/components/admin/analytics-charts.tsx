"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { trafficTrend, cityDistribution, conversionRateTrend } from "@/lib/mock/analytics";
import { statePerformance } from "@/lib/mock/state-performance";
import { formatCurrency, formatNumber } from "@/lib/utils";

const AXIS_STYLE = { fontSize: 11, fill: "#94a3b8" };
const TOOLTIP_STYLE = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
};

const CITY_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"];

export function TrafficTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={trafficTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="date" tick={AXIS_STYLE} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} interval={4} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={40} />
        <Tooltip formatter={(value) => formatNumber(Number(value))} contentStyle={TOOLTIP_STYLE} />
        <Line type="monotone" dataKey="visits" name="Visits" stroke="#2a78d6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CityDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={cityDistribution} margin={{ top: 20, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="city" tick={AXIS_STYLE} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={40} />
        <Tooltip formatter={(value) => formatNumber(Number(value))} contentStyle={TOOLTIP_STYLE} />
        <Bar dataKey="visits" radius={[4, 4, 0, 0]} maxBarSize={56}>
          {cityDistribution.map((entry, i) => (
            <Cell key={entry.city} fill={CITY_COLORS[i % CITY_COLORS.length]} />
          ))}
          <LabelList
            dataKey="visits"
            position="top"
            formatter={(value) => formatNumber(Number(value))}
            style={{ fontSize: 11, fill: "#475569", fontWeight: 500 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatePerformanceChart() {
  const chartHeight = statePerformance.length * 34 + 20;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={statePerformance}
        layout="vertical"
        margin={{ top: 4, right: 48, left: 8, bottom: 0 }}
      >
        <CartesianGrid stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={AXIS_STYLE} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
        <YAxis
          type="category"
          dataKey="state"
          tick={{ fontSize: 12, fill: "#334155" }}
          axisLine={false}
          tickLine={false}
          width={100}
        />
        <Tooltip
          formatter={(value, name) =>
            name === "revenue" ? formatCurrency(Number(value)) : formatNumber(Number(value))
          }
          contentStyle={TOOLTIP_STYLE}
        />
        <Bar dataKey="revenue" name="Revenue" fill="#2a78d6" radius={[0, 4, 4, 0]} maxBarSize={18}>
          <LabelList
            dataKey="revenue"
            position="right"
            formatter={(value) => formatCurrency(Number(value))}
            style={{ fontSize: 11, fill: "#475569", fontWeight: 500 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ConversionRateTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={conversionRateTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="date" tick={AXIS_STYLE} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} interval={4} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={40} unit="%" />
        <Tooltip formatter={(value) => `${value}%`} contentStyle={TOOLTIP_STYLE} />
        <Line type="monotone" dataKey="rate" name="Search-to-Contact %" stroke="#2a78d6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
