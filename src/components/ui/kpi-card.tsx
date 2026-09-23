"use client";

import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Card } from "./card";

export interface KpiSparklinePoint {
  value: number;
}

export function KPICard({
  label,
  value,
  icon: Icon,
  trend,
  sparkline,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: { direction: "up" | "down"; percent: string };
  sparkline?: KpiSparklinePoint[];
}) {
  const isUp = trend?.direction === "up";

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        {sparkline && sparkline.length > 1 && (
          <div className="h-8 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkline}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2a78d6"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {trend && (
        <div
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-xs font-medium",
            isUp ? "text-success-600" : "text-danger-600"
          )}
        >
          {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {trend.percent}
          <span className="font-normal text-slate-400">vs last period</span>
        </div>
      )}
    </Card>
  );
}
