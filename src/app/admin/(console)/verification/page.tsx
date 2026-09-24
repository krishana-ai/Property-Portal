"use client";

import { useState } from "react";
import { MoreHorizontal, Check, X, MessageCircleQuestion } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { FilterBar } from "@/components/ui/filter-bar";
import { Select } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTableController } from "@/hooks/use-table-controller";
import { formatDate } from "@/lib/utils";
import {
  ownerVerificationQueue,
  documentVerificationQueue,
  reraSignalsQueue,
  type VerificationItem,
  type VerificationStage,
} from "@/lib/mock/verification";

type QueueKey = "owner" | "document" | "rera";

const QUEUE_TABS: { label: string; value: QueueKey }[] = [
  { label: "Owner Verification", value: "owner" },
  { label: "Document Verification", value: "document" },
  { label: "RERA Signals", value: "rera" },
];

const STAGE_OPTIONS: { label: string; value: VerificationStage }[] = [
  { label: "Draft", value: "Draft" },
  { label: "Submitted", value: "Submitted" },
  { label: "AI Check", value: "AI Check" },
  { label: "Duplicate Check", value: "Duplicate Check" },
  { label: "Document Check", value: "Document Check" },
  { label: "Human Review", value: "Human Review" },
  { label: "Verified", value: "Verified" },
  { label: "Published", value: "Published" },
  { label: "Updated", value: "Updated" },
  { label: "Expired", value: "Expired" },
  { label: "Rejected", value: "Rejected" },
];

function VerificationQueueTable({
  data,
  onSetStage,
}: {
  data: VerificationItem[];
  onSetStage: (id: string, stage: VerificationStage) => void;
}) {
  const table = useTableController<VerificationItem>({
    data,
    searchableFields: ["name", "linkedTo", "id"],
    pageSize: 8,
  });

  const columns: DataTableColumn<VerificationItem>[] = [
    {
      key: "name",
      header: "Applicant / Listing",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-400">{row.id}</p>
        </div>
      ),
    },
    { key: "linkedTo", header: "Linked to", render: (row) => row.linkedTo },
    { key: "submitted", header: "Submitted", sortable: true, render: (row) => formatDate(row.submitted) },
    {
      key: "stage",
      header: "Stage",
      render: (row) => (
        <div>
          <StatusBadge status={row.stage} />
          {row.note && <p className="mt-1 text-xs text-slate-400">{row.note}</p>}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => onSetStage(row.id, "Verified")}>
              <Check className="h-3.5 w-3.5" /> Approve
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSetStage(row.id, "Human Review")}>
              <MessageCircleQuestion className="h-3.5 w-3.5" /> Request more info
            </DropdownMenuItem>
            <DropdownMenuItem destructive onSelect={() => onSetStage(row.id, "Rejected")}>
              <X className="h-3.5 w-3.5" /> Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4">
        <FilterBar
          searchValue={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search by name or linked record..."
          activeFilterCount={table.activeFilterCount}
          onClearFilters={table.clearFilters}
        >
          <Select
            className="w-40"
            options={STAGE_OPTIONS}
            placeholder="Stage"
            value={table.filters.stage ?? ""}
            onChange={(e) => table.setFilter("stage", e.target.value)}
          />
        </FilterBar>
      </div>

      <DataTable
        columns={columns}
        data={table.data}
        getRowId={(row) => row.id}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        page={table.page}
        pageSize={table.pageSize}
        total={table.total}
        onPageChange={table.setPage}
        emptyTitle="Queue is empty"
        emptyDescription="Nothing here matches your filters."
      />
    </>
  );
}

export default function VerificationPage() {
  const [queues, setQueues] = useState<Record<QueueKey, VerificationItem[]>>({
    owner: ownerVerificationQueue,
    document: documentVerificationQueue,
    rera: reraSignalsQueue,
  });
  const [activeQueue, setActiveQueue] = useState<QueueKey>("owner");

  function setStage(queue: QueueKey, id: string, stage: VerificationStage) {
    setQueues((prev) => ({
      ...prev,
      [queue]: prev[queue].map((item) => (item.id === id ? { ...item, stage } : item)),
    }));
  }

  return (
    <div>
      <PageHeader title="Verification" breadcrumb={["Admin", "Verification"]} />

      <Tabs value={activeQueue} onValueChange={(v) => setActiveQueue(v as QueueKey)}>
        <TabsList className="mb-4">
          {QUEUE_TABS.map((q) => (
            <TabsTrigger key={q.value} value={q.value}>
              {q.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {QUEUE_TABS.map((q) => (
          <TabsContent key={q.value} value={q.value}>
            <VerificationQueueTable
              data={queues[q.value]}
              onSetStage={(id, stage) => setStage(q.value, id, stage)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
