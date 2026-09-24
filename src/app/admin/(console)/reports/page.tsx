"use client";

import { useState } from "react";
import { Download, FileDown } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FunnelChart } from "@/components/admin/reports/funnel-chart";
import { useTableController } from "@/hooks/use-table-controller";
import { exportToCsv, formatCurrency } from "@/lib/utils";
import { conversionFunnel, revenueReportRows, REPORT_CITY_OPTIONS, type RevenueRow } from "@/lib/mock/reports";

const CITY_OPTIONS = REPORT_CITY_OPTIONS.map((city) => ({ label: city, value: city }));

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("Last 30 days");
  const table = useTableController<RevenueRow>({
    data: revenueReportRows,
    searchableFields: ["plan", "city", "period"],
    pageSize: 8,
  });

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        breadcrumb={["Admin", "Reports"]}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportToCsv("revenue-report.csv", table.data as unknown as Record<string, unknown>[])}
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button variant="secondary" size="sm" onClick={() => window.print()}>
              <FileDown className="h-3.5 w-3.5" /> Export PDF
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <Select
          className="w-36"
          options={CITY_OPTIONS}
          placeholder="City"
          value={table.filters.city ?? ""}
          onChange={(e) => table.setFilter("city", e.target.value)}
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Conversion Funnel — Search to Deal</CardTitle>
        </CardHeader>
        <CardContent>
          <FunnelChart steps={conversionFunnel} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Plan / City / Period</CardTitle>
        </CardHeader>
        <DataTable
          columns={
            [
              { key: "plan", header: "Plan", sortable: true, render: (row) => row.plan },
              { key: "city", header: "City", sortable: true, render: (row) => row.city },
              { key: "period", header: "Period", sortable: true, render: (row) => row.period },
              {
                key: "revenue",
                header: "Revenue",
                sortable: true,
                render: (row) => <span className="font-medium text-slate-900">{formatCurrency(row.revenue)}</span>,
              },
            ] as DataTableColumn<RevenueRow>[]
          }
          data={table.data}
          getRowId={(row) => `${row.plan}-${row.city}-${row.period}`}
          sortKey={table.sortKey}
          sortDirection={table.sortDirection}
          onSortChange={table.onSortChange}
          page={table.page}
          pageSize={table.pageSize}
          total={table.total}
          onPageChange={table.setPage}
          emptyTitle="No revenue data found"
          emptyDescription="Try adjusting your filters."
        />
      </Card>
    </div>
  );
}
