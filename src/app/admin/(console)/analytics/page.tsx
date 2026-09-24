"use client";

import { Globe, Users, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TrafficTrendChart,
  CityDistributionChart,
  ConversionRateTrendChart,
  StatePerformanceChart,
} from "@/components/admin/analytics-charts";
import { analyticsKpis } from "@/lib/mock/analytics";
import { statePerformance } from "@/lib/mock/state-performance";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" breadcrumb={["Admin", "Analytics"]} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total Traffic" value={analyticsKpis.totalTraffic} icon={Globe} />
        <KPICard label="Unique Visitors" value={analyticsKpis.uniqueVisitors} icon={Users} />
        <KPICard label="Top City" value={analyticsKpis.topCity} icon={MapPin} />
        <KPICard label="Avg Session Time" value={analyticsKpis.avgSessionTime} icon={Clock} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Trend (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <TrafficTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>City-wise Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <CityDistributionChart />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Search-to-Contact Conversion Rate (last 30 days)</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ConversionRateTrendChart />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>State-wise Performance — Properties Sold &amp; Revenue</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="mb-4 text-xs text-slate-400">
            A literal map view needs a Maps API key (see Settings → API Keys). Ranked by revenue until one is
            configured.
          </p>
          <StatePerformanceChart />
        </CardContent>
        <div className="overflow-x-auto border-t border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5">State</th>
                <th className="px-4 py-2.5">Properties Sold</th>
                <th className="px-4 py-2.5">Revenue</th>
                <th className="px-4 py-2.5">Avg. Revenue / Property</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {statePerformance.map((row) => (
                <tr key={row.state}>
                  <td className="px-4 py-2.5 font-medium text-slate-900">{row.state}</td>
                  <td className="px-4 py-2.5 text-slate-600">{formatNumber(row.propertiesSold)}</td>
                  <td className="px-4 py-2.5 text-slate-600">{formatCurrency(row.revenue)}</td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {formatCurrency(Math.round(row.revenue / row.propertiesSold))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
