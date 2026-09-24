"use client";

import { useRouter } from "next/navigation";
import { Home, MoreHorizontal, Eye, GitMerge, Pencil, Trash2, Plus } from "lucide-react";
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
import { MergePropertiesDialog } from "@/components/admin/properties/merge-properties-dialog";
import { useTableController } from "@/hooks/use-table-controller";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteProperty, mergeProperties } from "@/lib/redux/slices/properties-slice";
import { type CanonicalProperty } from "@/lib/mock/properties";
import { useState } from "react";

const TYPE_OPTIONS = [
  { label: "Apartment", value: "Apartment" },
  { label: "Villa", value: "Villa" },
  { label: "Plot", value: "Plot" },
  { label: "Commercial", value: "Commercial" },
  { label: "Office", value: "Office" },
  { label: "PG", value: "PG" },
];

const CANONICAL_STATUS_OPTIONS = [
  { label: "Canonical", value: "Canonical" },
  { label: "Under Review", value: "Under Review" },
  { label: "Duplicate Candidate", value: "Duplicate Candidate" },
];

export default function PropertiesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const properties = useAppSelector((state) => state.properties.items);

  const cityOptions = Array.from(new Set(properties.map((p) => p.city))).map((city) => ({
    label: city,
    value: city,
  }));

  const table = useTableController<CanonicalProperty>({
    data: properties,
    searchableFields: ["address", "id"],
    pageSize: 8,
  });

  const mergeDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const [activeProperty, setActiveProperty] = useState<CanonicalProperty | null>(null);

  function openMerge(property: CanonicalProperty) {
    setActiveProperty(property);
    mergeDialog.onOpen();
  }

  function openDelete(property: CanonicalProperty) {
    setActiveProperty(property);
    deleteDialog.onOpen();
  }

  function handleMerge(targetId: string) {
    if (!activeProperty) return;
    dispatch(mergeProperties({ sourceId: activeProperty.id, targetId }));
  }

  function handleDeleteConfirmed() {
    if (!activeProperty) return;
    dispatch(deleteProperty(activeProperty.id));
  }

  const columns: DataTableColumn<CanonicalProperty>[] = [
    {
      key: "address",
      header: "Property",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <ImagePlaceholder icon={Home} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{row.address}</p>
            <p className="text-xs text-slate-400">{row.id}</p>
          </div>
        </div>
      ),
    },
    { key: "type", header: "Type", render: (row) => row.type },
    { key: "city", header: "City", sortable: true, render: (row) => row.city },
    {
      key: "linkedListings",
      header: "Linked listings",
      sortable: true,
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/properties/${row.id}`);
          }}
          className="cursor-pointer font-medium text-primary-600 hover:underline"
        >
          {row.linkedListings.length}
        </button>
      ),
    },
    {
      key: "canonicalStatus",
      header: "Canonical status",
      render: (row) => <StatusBadge status={row.canonicalStatus} />,
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
            <DropdownMenuItem onSelect={() => router.push(`/admin/properties/${row.id}`)}>
              <Eye className="h-3.5 w-3.5" /> View details
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push(`/admin/properties/${row.id}/edit`)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => openMerge(row)}>
              <GitMerge className="h-3.5 w-3.5" /> Merge into another property
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
        title="Properties"
        breadcrumb={["Admin", "Properties"]}
        action={
          <Button size="sm" onClick={() => router.push("/admin/properties/new")}>
            <Plus className="h-3.5 w-3.5" /> Add Property
          </Button>
        }
      />

      <div className="mb-4">
        <FilterBar
          searchValue={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search by address or property ID..."
          activeFilterCount={table.activeFilterCount}
          onClearFilters={table.clearFilters}
        >
          <Select
            className="w-36"
            options={cityOptions}
            placeholder="City"
            value={table.filters.city ?? ""}
            onChange={(e) => table.setFilter("city", e.target.value)}
          />
          <Select
            className="w-36"
            options={TYPE_OPTIONS}
            placeholder="Property type"
            value={table.filters.type ?? ""}
            onChange={(e) => table.setFilter("type", e.target.value)}
          />
          <Select
            className="w-44"
            options={CANONICAL_STATUS_OPTIONS}
            placeholder="Canonical status"
            value={table.filters.canonicalStatus ?? ""}
            onChange={(e) => table.setFilter("canonicalStatus", e.target.value)}
          />
        </FilterBar>
      </div>

      <DataTable
        columns={columns}
        data={table.data}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/properties/${row.id}`)}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        page={table.page}
        pageSize={table.pageSize}
        total={table.total}
        onPageChange={table.setPage}
        emptyTitle="No properties found"
        emptyDescription="Try adjusting your search or filters."
      />

      <MergePropertiesDialog
        property={activeProperty}
        candidates={properties}
        open={mergeDialog.isOpen}
        onOpenChange={(open) => (open ? mergeDialog.onOpen() : mergeDialog.onClose())}
        onMerge={handleMerge}
      />

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${activeProperty?.address ?? ""}"?`}
        description="This will permanently remove this property record. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
