"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Map, MoreHorizontal, Eye, Pencil, Trash2, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { FilterBar } from "@/components/ui/filter-bar";
import { Button } from "@/components/ui/button";
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
import { ConversionMasterCard } from "@/components/admin/townships/conversion-master-card";
import { useTableController } from "@/hooks/use-table-controller";
import { useDisclosure } from "@/hooks/use-disclosure";
import { type Township } from "@/lib/mock/townships";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteTownship } from "@/lib/redux/slices/townships-slice";

export default function TownshipsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const townships = useAppSelector((state) => state.townships.items);

  const table = useTableController<Township>({
    data: townships,
    searchableFields: ["name", "location"],
    pageSize: 8,
  });

  const deleteDialog = useDisclosure();
  const [activeTownship, setActiveTownship] = useState<Township | null>(null);

  function openDelete(township: Township) {
    setActiveTownship(township);
    deleteDialog.onOpen();
  }

  function handleDeleteConfirmed() {
    if (!activeTownship) return;
    dispatch(deleteTownship(activeTownship.id));
  }

  const columns: DataTableColumn<Township>[] = [
    {
      key: "name",
      header: "Township",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <ImagePlaceholder icon={Map} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-400">{row.id}</p>
          </div>
        </div>
      ),
    },
    { key: "location", header: "Location", render: (row) => row.location },
    {
      key: "subProjects",
      header: "Sub-projects",
      render: (row) => row.subProjects.length,
    },
    { key: "totalArea", header: "Total Area", render: (row) => row.totalArea },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
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
            <DropdownMenuItem onSelect={() => router.push(`/admin/townships/${row.id}`)}>
              <Eye className="h-3.5 w-3.5" /> View sub-projects
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push(`/admin/townships/${row.id}/edit`)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
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
        title="Townships"
        breadcrumb={["Admin", "Townships"]}
        action={
          <Button size="sm" onClick={() => router.push("/admin/townships/new")}>
            <Plus className="h-3.5 w-3.5" /> Add Township
          </Button>
        }
      />

      <div className="mb-4">
        <FilterBar
          searchValue={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search by name or location..."
          activeFilterCount={table.activeFilterCount}
          onClearFilters={table.clearFilters}
        />
      </div>

      <DataTable
        columns={columns}
        data={table.data}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/townships/${row.id}`)}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        page={table.page}
        pageSize={table.pageSize}
        total={table.total}
        onPageChange={table.setPage}
        emptyTitle="No townships found"
        emptyDescription="Try adjusting your search."
      />

      <div className="mt-6">
        <ConversionMasterCard />
      </div>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${activeTownship?.name ?? ""}"?`}
        description="This will permanently remove the township and its sub-projects. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
