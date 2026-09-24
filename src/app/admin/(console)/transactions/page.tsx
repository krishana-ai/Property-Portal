"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DealStepper } from "@/components/admin/transactions/deal-stepper";
import { TransactionDetailDialog } from "@/components/admin/transactions/transaction-detail-dialog";
import { useTableController } from "@/hooks/use-table-controller";
import { useDisclosure } from "@/hooks/use-disclosure";
import { mockDeals, type Deal } from "@/lib/mock/transactions";

export default function TransactionsPage() {
  const table = useTableController<Deal>({
    data: mockDeals,
    searchableFields: ["id", "buyer", "property"],
    pageSize: 8,
  });
  const detailDialog = useDisclosure();
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  function openDeal(deal: Deal) {
    setActiveDeal(deal);
    detailDialog.onOpen();
  }

  const columns: DataTableColumn<Deal>[] = [
    { key: "id", header: "Deal ID", sortable: true, render: (row) => <span className="font-medium text-slate-900">{row.id}</span> },
    { key: "buyer", header: "Buyer", sortable: true, render: (row) => row.buyer },
    { key: "property", header: "Property", render: (row) => row.property },
    {
      key: "currentStage",
      header: "Progress",
      className: "min-w-[20rem]",
      render: (row) => <DealStepper currentStage={row.currentStage} />,
    },
  ];

  return (
    <div>
      <PageHeader title="Transactions" breadcrumb={["Admin", "Transactions"]} />

      <div className="mb-4">
        <FilterBar
          searchValue={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search by deal ID, buyer, or property..."
          activeFilterCount={table.activeFilterCount}
          onClearFilters={table.clearFilters}
        />
      </div>

      <DataTable
        columns={columns}
        data={table.data}
        getRowId={(row) => row.id}
        onRowClick={openDeal}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        page={table.page}
        pageSize={table.pageSize}
        total={table.total}
        onPageChange={table.setPage}
        emptyTitle="No transactions found"
        emptyDescription="Try adjusting your search."
      />

      <TransactionDetailDialog
        deal={activeDeal}
        open={detailDialog.isOpen}
        onOpenChange={(open) => (open ? detailDialog.onOpen() : detailDialog.onClose())}
      />
    </div>
  );
}
