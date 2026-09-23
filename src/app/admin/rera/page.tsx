"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Scale, MoreHorizontal, Eye, ShieldCheck, Flag, Pencil, Trash2, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { Select } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTableController } from "@/hooks/use-table-controller";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatDate } from "@/lib/utils";
import { type ReraRecord } from "@/lib/mock/rera";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteReraRecord, setReraCompliance } from "@/lib/redux/slices/rera-slice";

const COMPLIANCE_OPTIONS = [
  { label: "RERA Registered", value: "RERA Registered" },
  { label: "Expiring Soon", value: "Expiring Soon" },
  { label: "Non-Compliant", value: "Non-Compliant" },
];

export default function ReraPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const records = useAppSelector((state) => state.rera.items);

  const table = useTableController<ReraRecord>({
    data: records,
    searchableFields: ["projectName", "reraNumber", "state"],
    pageSize: 8,
  });

  const deleteDialog = useDisclosure();
  const [activeRecord, setActiveRecord] = useState<ReraRecord | null>(null);

  function openDelete(record: ReraRecord) {
    setActiveRecord(record);
    deleteDialog.onOpen();
  }

  function handleDeleteConfirmed() {
    if (!activeRecord) return;
    dispatch(deleteReraRecord(activeRecord.id));
  }

  const columns: DataTableColumn<ReraRecord>[] = [
    {
      key: "projectName",
      header: "Project",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <ImagePlaceholder icon={Scale} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{row.projectName}</p>
            <p className="text-xs text-slate-400">{row.reraNumber}</p>
          </div>
        </div>
      ),
    },
    { key: "state", header: "State", sortable: true, render: (row) => row.state },
    { key: "validity", header: "Valid until", sortable: true, render: (row) => formatDate(row.validity) },
    {
      key: "complianceStatus",
      header: "Compliance",
      render: (row) => <StatusBadge status={row.complianceStatus} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onSelect={() => router.push(`/admin/rera/${row.id}`)}>
              <Eye className="h-3.5 w-3.5" /> View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => dispatch(setReraCompliance({ id: row.id, complianceStatus: "RERA Registered" }))}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Verify
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push(`/admin/rera/${row.id}/edit`)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              destructive
              onSelect={() => dispatch(setReraCompliance({ id: row.id, complianceStatus: "Non-Compliant" }))}
            >
              <Flag className="h-3.5 w-3.5" /> Flag
            </DropdownMenuItem>
            <DropdownMenuItem destructive onSelect={() => openDelete(row)}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="RERA Compliance"
        breadcrumb={["Admin", "RERA"]}
        action={
          <Button size="sm" onClick={() => router.push("/admin/rera/new")}>
            <Plus className="h-3.5 w-3.5" /> Add RERA Record
          </Button>
        }
      />

      <div className="mb-4">
        <FilterBar
          searchValue={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search by project, RERA number, or state..."
          activeFilterCount={table.activeFilterCount}
          onClearFilters={table.clearFilters}
        >
          <Select
            className="w-44"
            options={COMPLIANCE_OPTIONS}
            placeholder="Compliance status"
            value={table.filters.complianceStatus ?? ""}
            onChange={(e) => table.setFilter("complianceStatus", e.target.value)}
          />
        </FilterBar>
      </div>

      <DataTable
        columns={columns}
        data={table.data}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/rera/${row.id}`)}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        page={table.page}
        pageSize={table.pageSize}
        total={table.total}
        onPageChange={table.setPage}
        emptyTitle="No RERA records found"
        emptyDescription="Try adjusting your search or filters."
      />

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${activeRecord?.projectName ?? ""}"?`}
        description="This will permanently remove this RERA record. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
