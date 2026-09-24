"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  MoreHorizontal,
  Eye,
  Pencil,
  Check,
  X,
  Trash2,
  Plus,
  EyeOff,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { Select } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { BulkActionBar } from "@/components/ui/bulk-action-bar";
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
import { type Listing } from "@/lib/mock/listings";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  deleteListing,
  deleteListings,
  setListingStatus,
  setListingsStatus,
  toggleListingActive,
} from "@/lib/redux/slices/listings-slice";

const STATUS_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

const TYPE_OPTIONS = [
  { label: "Apartment", value: "Apartment" },
  { label: "Villa", value: "Villa" },
  { label: "Plot", value: "Plot" },
  { label: "Commercial", value: "Commercial" },
  { label: "Office", value: "Office" },
  { label: "PG", value: "PG" },
];

const POSTED_BY_OPTIONS = [
  { label: "Owner", value: "Owner" },
  { label: "Agent", value: "Agent" },
  { label: "Builder", value: "Builder" },
];

export default function ListingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const listings = useAppSelector((state) => state.listings.items);

  const table = useTableController<Listing>({
    data: listings,
    searchableFields: ["title", "city"],
    pageSize: 8,
  });

  const deleteDialog = useDisclosure();
  const [deletingListing, setDeletingListing] = useState<Listing | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  function confirmDelete(listing: Listing) {
    setDeletingListing(listing);
    deleteDialog.onOpen();
  }

  function handleDeleteConfirmed() {
    if (!deletingListing) return;
    dispatch(deleteListing(deletingListing.id));
    table.setSelectedIds(table.selectedIds.filter((id) => id !== deletingListing.id));
  }

  function handleBulkApprove() {
    dispatch(setListingsStatus({ ids: table.selectedIds, status: "Approved" }));
    table.setSelectedIds([]);
  }

  function handleBulkReject() {
    dispatch(setListingsStatus({ ids: table.selectedIds, status: "Rejected" }));
    table.setSelectedIds([]);
  }

  function handleBulkDeleteConfirmed() {
    dispatch(deleteListings(table.selectedIds));
    table.setSelectedIds([]);
  }

  const columns: DataTableColumn<Listing>[] = [
    {
      key: "title",
      header: "Listing",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <ImagePlaceholder icon={Building2} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{row.title}</p>
            <p className="text-xs text-slate-400">{row.id}</p>
          </div>
        </div>
      ),
    },
    { key: "city", header: "City", sortable: true, render: (row) => row.city },
    { key: "type", header: "Type", render: (row) => row.type },
    { key: "price", header: "Price", sortable: true, render: (row) => row.price },
    { key: "postedBy", header: "Posted by", render: (row) => row.postedBy },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "isActive",
      header: "Visibility",
      render: (row) => <StatusBadge status={row.isActive ? "Active" : "Inactive"} />,
    },
    { key: "date", header: "Date", sortable: true, render: (row) => formatDate(row.date) },
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
            <DropdownMenuItem onSelect={() => router.push(`/admin/listings/${row.id}`)}>
              <Eye className="h-3.5 w-3.5" /> View details
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push(`/admin/listings/${row.id}/edit`)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => dispatch(toggleListingActive(row.id))}>
              {row.isActive ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" /> Deactivate
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" /> Activate
                </>
              )}
            </DropdownMenuItem>
            {row.status !== "Approved" && (
              <DropdownMenuItem
                onSelect={() => dispatch(setListingStatus({ id: row.id, status: "Approved" }))}
              >
                <Check className="h-3.5 w-3.5" /> Approve
              </DropdownMenuItem>
            )}
            {row.status !== "Rejected" && (
              <DropdownMenuItem
                destructive
                onSelect={() => dispatch(setListingStatus({ id: row.id, status: "Rejected" }))}
              >
                <X className="h-3.5 w-3.5" /> Reject
              </DropdownMenuItem>
            )}
            <DropdownMenuItem destructive onSelect={() => confirmDelete(row)}>
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
        title="Listings Moderation"
        breadcrumb={["Admin", "Listings"]}
        action={
          <Button size="sm" onClick={() => router.push("/admin/listings/new")}>
            <Plus className="h-3.5 w-3.5" /> Add Listing
          </Button>
        }
      />

      <div className="mb-4">
        <FilterBar
          searchValue={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search by title or city..."
          activeFilterCount={table.activeFilterCount}
          onClearFilters={table.clearFilters}
        >
          <Select
            className="w-36"
            options={STATUS_OPTIONS}
            placeholder="Status"
            value={table.filters.status ?? ""}
            onChange={(e) => table.setFilter("status", e.target.value)}
          />
          <Select
            className="w-36"
            options={TYPE_OPTIONS}
            placeholder="Property type"
            value={table.filters.type ?? ""}
            onChange={(e) => table.setFilter("type", e.target.value)}
          />
          <Select
            className="w-32"
            options={POSTED_BY_OPTIONS}
            placeholder="Posted by"
            value={table.filters.postedBy ?? ""}
            onChange={(e) => table.setFilter("postedBy", e.target.value)}
          />
        </FilterBar>
      </div>

      <div className="mb-4">
        <BulkActionBar count={table.selectedIds.length} onClear={() => table.setSelectedIds([])}>
          <Button size="sm" className="bg-success-600 text-white hover:bg-emerald-700" onClick={handleBulkApprove}>
            Approve selected
          </Button>
          <Button size="sm" variant="destructive" onClick={handleBulkReject}>
            Reject selected
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setBulkDeleteOpen(true)}>
            <Trash2 className="h-3.5 w-3.5" /> Delete selected
          </Button>
        </BulkActionBar>
      </div>

      <DataTable
        columns={columns}
        data={table.data}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/listings/${row.id}`)}
        selectable
        selectedIds={table.selectedIds}
        onSelectionChange={table.setSelectedIds}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        page={table.page}
        pageSize={table.pageSize}
        total={table.total}
        onPageChange={table.setPage}
        emptyTitle="No listings found"
        emptyDescription="Try adjusting your search or filters."
      />

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${deletingListing?.title ?? ""}"?`}
        description="This will permanently remove the listing. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${table.selectedIds.length} listing(s)?`}
        description="This will permanently remove the selected listings. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleBulkDeleteConfirmed}
      />
    </div>
  );
}
