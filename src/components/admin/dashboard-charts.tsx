"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { listingsLeadsTrend, revenueByPlan } from "@/lib/mock/dashboard";
import { formatCurrency } from "@/lib/utils";

const AXIS_STYLE = { fontSize: 11, fill: "#94a3b8" };

export function ListingsLeadsTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={listingsLeadsTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="date"
          tick={AXIS_STYLE}
          axisLine={{ stroke: "#e2e8f0" }}
          tickLine={false}
          interval={4}
        />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          height={28}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: "#475569" }}
        />
        <Line
          type="monotone"
          dataKey="listings"
          name="Listings"
          stroke="#2a78d6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="leads"
          name="Leads"
          stroke="#eb6834"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const PLAN_COLORS: Record<string, string> = {
  Free: "#2a78d6",
  Featured: "#eb6834",
  Premium: "#1baf7a",
  Top: "#eda100",
};

export function RevenueByPlanChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={revenueByPlan} margin={{ top: 20, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="plan" tick={AXIS_STYLE} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          }}
        />
        <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={56}>
          {revenueByPlan.map((entry) => (
            <Cell key={entry.plan} fill={PLAN_COLORS[entry.plan]} />
          ))}
          <LabelList
            dataKey="revenue"
            position="top"
            formatter={(value) => formatCurrency(Number(value))}
            style={{ fontSize: 11, fill: "#475569", fontWeight: 500 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
