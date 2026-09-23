"use client";

import { useState } from "react";
import { GitMerge, X, Copy } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DuplicatePairCard } from "@/components/admin/duplicates/duplicate-pair-card";
import { useTableController } from "@/hooks/use-table-controller";
import { useDisclosure } from "@/hooks/use-disclosure";
import { mockDuplicates, type DuplicatePair } from "@/lib/mock/duplicates";

function confidenceVariant(confidence: number): "danger" | "warning" | "info" {
  if (confidence >= 85) return "danger";
  if (confidence >= 70) return "warning";
  return "info";
}

export default function DuplicatesPage() {
  const [pairs, setPairs] = useState<DuplicatePair[]>(mockDuplicates);
  const table = useTableController<DuplicatePair>({
    data: pairs,
    searchableFields: ["id"],
    pageSize: 8,
  });

  const mergeDialog = useDisclosure();
  const [activePair, setActivePair] = useState<DuplicatePair | null>(null);

  function resolve(id: string) {
    setPairs((prev) => prev.filter((p) => p.id !== id));
  }

  function confirmMerge(pair: DuplicatePair) {
    setActivePair(pair);
    mergeDialog.onOpen();
  }

  const columns: DataTableColumn<DuplicatePair>[] = [
    {
      key: "pair",
      header: "Flagged pair",
      render: (row) => <DuplicatePairCard a={row.propertyA} b={row.propertyB} />,
    },
    {
      key: "confidence",
      header: "Match confidence",
      sortable: true,
      render: (row) => (
        <Badge variant={confidenceVariant(row.confidence)}>{row.confidence}% match</Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            className="bg-success-600 text-white hover:bg-emerald-700"
            onClick={() => confirmMerge(row)}
          >
            <GitMerge className="h-3.5 w-3.5" /> Merge
          </Button>
          <Button size="sm" variant="secondary" onClick={() => resolve(row.id)}>
            <Copy className="h-3.5 w-3.5" /> Keep Both
          </Button>
          <Button size="sm" variant="ghost" onClick={() => resolve(row.id)}>
            <X className="h-3.5 w-3.5" /> Dismiss
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Duplicate Listings" breadcrumb={["Admin", "Duplicates"]} />

      <div className="mb-4">
        <FilterBar
          searchValue={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search by listing ID..."
          activeFilterCount={table.activeFilterCount}
          onClearFilters={table.clearFilters}
        />
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
        emptyTitle="No flagged duplicates"
        emptyDescription="Nothing here matches your filters."
      />

      <ConfirmDialog
        open={mergeDialog.isOpen}
        onOpenChange={(open) => (open ? mergeDialog.onOpen() : mergeDialog.onClose())}
        title={`Merge ${activePair?.propertyA.id} into ${activePair?.propertyB.id}?`}
        description="Both listings will be combined into a single canonical property record. This action cannot be undone."
        confirmLabel="Merge"
        destructive={false}
        onConfirm={() => activePair && resolve(activePair.id)}
      />
    </div>
  );
}
