"use client";

import {
  Building2,
  Clock,
  Users,
  PhoneCall,
  DollarSign,
  Flag,
} from "lucide-react";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import {
  ListingsLeadsTrendChart,
  RevenueByPlanChart,
} from "@/components/admin/dashboard-charts";
import { dashboardKpis, pendingModerationQueue } from "@/lib/mock/dashboard";
import { useAppSelector } from "@/lib/redux/hooks";

const KPI_ICONS = [Building2, Clock, Users, PhoneCall, DollarSign, Flag];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function AdminDashboardPage() {
  const currentAdmin = useAppSelector((state) => state.auth.currentAdmin);
  const firstName = currentAdmin.name.split(" ")[0];
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-xs text-slate-400">Admin / Dashboard</p>
        <h1 className="text-xl font-semibold text-slate-900">
          {greeting()}, {firstName}
        </h1>
        <p className="text-sm text-slate-500">{today} · Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {dashboardKpis.map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} icon={KPI_ICONS[i]} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Listings & Leads (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ListingsLeadsTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan Type</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <RevenueByPlanChart />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pending Moderation Queue</CardTitle>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </CardHeader>
        <div className="divide-y divide-slate-100">
          {pendingModerationQueue.map((listing) => (
            <div key={listing.id} className="flex items-center gap-4 px-6 py-3">
              <ImagePlaceholder icon={Building2} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{listing.title}</p>
                <p className="text-xs text-slate-500">
                  {listing.city} · Posted by {listing.postedBy} · {listing.price}
                </p>
              </div>
              <span className="hidden text-xs text-slate-400 sm:block">{listing.submitted}</span>
              <div className="flex shrink-0 items-center gap-2">
                <Button size="sm" className="bg-success-600 text-white hover:bg-emerald-700">
                  Approve
                </Button>
                <Button size="sm" variant="destructive">
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
