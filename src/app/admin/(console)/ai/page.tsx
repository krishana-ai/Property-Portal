"use client";

import { Bot, Zap, AlertTriangle, ShieldAlert, Check, X, Pencil } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { useTableController } from "@/hooks/use-table-controller";
import { formatDate } from "@/lib/utils";
import { aiKpis, aiToolStats, aiReviewQueue, type AiToolStat, type AiReviewItem } from "@/lib/mock/ai-governance";

export default function AiGovernancePage() {
  const toolsTable = useTableController<AiToolStat>({
    data: aiToolStats,
    searchableFields: ["toolName"],
    pageSize: 10,
  });
  const reviewTable = useTableController<AiReviewItem>({
    data: aiReviewQueue,
    searchableFields: ["target", "outputType"],
    pageSize: 10,
  });

  const toolColumns: DataTableColumn<AiToolStat>[] = [
    { key: "toolName", header: "Tool", sortable: true, render: (row) => <code className="text-xs font-medium text-slate-900">{row.toolName}</code> },
    { key: "callsToday", header: "Calls today", sortable: true, render: (row) => row.callsToday.toLocaleString() },
    { key: "errorRate", header: "Error rate", sortable: true, render: (row) => row.errorRate },
    { key: "avgLatency", header: "Avg latency", sortable: true, render: (row) => row.avgLatency },
    {
      key: "lastFlagged",
      header: "Last flagged output",
      render: (row) => <span className="text-slate-500">{row.lastFlagged}</span>,
    },
  ];

  const reviewColumns: DataTableColumn<AiReviewItem>[] = [
    {
      key: "outputType",
      header: "Output type",
      render: (row) => <Badge variant="info">{row.outputType}</Badge>,
    },
    { key: "target", header: "Target", sortable: true, render: (row) => row.target },
    { key: "snippet", header: "Flagged snippet", render: (row) => <span className="text-slate-600">{row.snippet}</span> },
    { key: "confidence", header: "Confidence", sortable: true, render: (row) => `${row.confidence}%` },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "flaggedAt", header: "Flagged", sortable: true, render: (row) => formatDate(row.flaggedAt) },
    {
      key: "actions",
      header: "",
      render: () => (
        <div className="flex items-center gap-1.5">
          <Button size="sm" className="bg-success-600 text-white hover:bg-emerald-700">
            <Check className="h-3.5 w-3.5" /> Approve
          </Button>
          <Button size="sm" variant="secondary">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button size="sm" variant="destructive">
            <X className="h-3.5 w-3.5" /> Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="AI Governance" breadcrumb={["Admin", "AI Governance"]} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="AI Calls Today" value={aiKpis.callsToday} icon={Bot} />
        <KPICard label="Avg Response Time" value={aiKpis.avgResponseTime} icon={Zap} />
        <KPICard label="Flagged Outputs" value={aiKpis.flaggedOutputs} icon={AlertTriangle} />
        <KPICard label="Tool-call Error Rate" value={aiKpis.toolErrorRate} icon={ShieldAlert} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>AI Tool Usage</CardTitle>
        </CardHeader>
        <DataTable
          columns={toolColumns}
          data={toolsTable.data}
          getRowId={(row) => row.id}
          sortKey={toolsTable.sortKey}
          sortDirection={toolsTable.sortDirection}
          onSortChange={toolsTable.onSortChange}
          page={toolsTable.page}
          pageSize={toolsTable.pageSize}
          total={toolsTable.total}
          onPageChange={toolsTable.setPage}
          emptyTitle="No tool data"
        />
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quality Review Queue</CardTitle>
        </CardHeader>
        <DataTable
          columns={reviewColumns}
          data={reviewTable.data}
          getRowId={(row) => row.id}
          sortKey={reviewTable.sortKey}
          sortDirection={reviewTable.sortDirection}
          onSortChange={reviewTable.onSortChange}
          page={reviewTable.page}
          pageSize={reviewTable.pageSize}
          total={reviewTable.total}
          onPageChange={reviewTable.setPage}
          emptyTitle="Nothing flagged for review"
          emptyDescription="AI outputs needing human review will appear here."
        />
      </Card>
    </div>
  );
}
