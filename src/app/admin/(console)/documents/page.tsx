"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, MoreHorizontal, Eye, Download, Check, X, Pencil, Trash2, Plus } from "lucide-react";
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
import { type DocumentRecord } from "@/lib/mock/documents";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteDocument, setDocumentStatus } from "@/lib/redux/slices/documents-slice";

const STATUS_OPTIONS = [
  { label: "Uploaded", value: "Uploaded" },
  { label: "Under Review", value: "Under Review" },
  { label: "Verified", value: "Verified" },
  { label: "Rejected", value: "Rejected" },
];

const ENTITY_OPTIONS = [
  { label: "User", value: "User" },
  { label: "Listing", value: "Listing" },
  { label: "Project", value: "Project" },
];

export default function DocumentsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const documents = useAppSelector((state) => state.documents.items);

  const table = useTableController<DocumentRecord>({
    data: documents,
    searchableFields: ["docType", "linkedEntityName"],
    pageSize: 8,
  });

  const deleteDialog = useDisclosure();
  const [activeDocument, setActiveDocument] = useState<DocumentRecord | null>(null);

  function openDelete(doc: DocumentRecord) {
    setActiveDocument(doc);
    deleteDialog.onOpen();
  }

  function handleDeleteConfirmed() {
    if (!activeDocument) return;
    dispatch(deleteDocument(activeDocument.id));
  }

  const columns: DataTableColumn<DocumentRecord>[] = [
    {
      key: "docType",
      header: "Document",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <ImagePlaceholder icon={FileText} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{row.docType}</p>
            <p className="text-xs text-slate-400">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "linkedEntityName",
      header: "Linked entity",
      render: (row) => (
        <div>
          <p className="text-slate-700">{row.linkedEntityName}</p>
          <p className="text-xs text-slate-400">{row.linkedEntityType}</p>
        </div>
      ),
    },
    { key: "uploadDate", header: "Uploaded", sortable: true, render: (row) => formatDate(row.uploadDate) },
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
            <DropdownMenuItem onSelect={() => router.push(`/admin/documents/${row.id}`)}>
              <Eye className="h-3.5 w-3.5" /> View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-3.5 w-3.5" /> Download
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push(`/admin/documents/${row.id}/edit`)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            {row.status !== "Verified" && (
              <DropdownMenuItem onSelect={() => dispatch(setDocumentStatus({ id: row.id, status: "Verified" }))}>
                <Check className="h-3.5 w-3.5" /> Approve
              </DropdownMenuItem>
            )}
            {row.status !== "Rejected" && (
              <DropdownMenuItem
                destructive
                onSelect={() => dispatch(setDocumentStatus({ id: row.id, status: "Rejected" }))}
              >
                <X className="h-3.5 w-3.5" /> Reject
              </DropdownMenuItem>
            )}
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
        title="Document Repository"
        breadcrumb={["Admin", "Documents"]}
        action={
          <Button size="sm" onClick={() => router.push("/admin/documents/new")}>
            <Plus className="h-3.5 w-3.5" /> Add Document
          </Button>
        }
      />

      <div className="mb-4">
        <FilterBar
          searchValue={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search by document type or linked entity..."
          activeFilterCount={table.activeFilterCount}
          onClearFilters={table.clearFilters}
        >
          <Select
            className="w-36"
            options={ENTITY_OPTIONS}
            placeholder="Entity type"
            value={table.filters.linkedEntityType ?? ""}
            onChange={(e) => table.setFilter("linkedEntityType", e.target.value)}
          />
          <Select
            className="w-40"
            options={STATUS_OPTIONS}
            placeholder="Status"
            value={table.filters.status ?? ""}
            onChange={(e) => table.setFilter("status", e.target.value)}
          />
        </FilterBar>
      </div>

      <DataTable
        columns={columns}
        data={table.data}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/documents/${row.id}`)}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        page={table.page}
        pageSize={table.pageSize}
        total={table.total}
        onPageChange={table.setPage}
        emptyTitle="No documents found"
        emptyDescription="Try adjusting your search or filters."
      />

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${activeDocument?.docType ?? ""}"?`}
        description="This will permanently remove this document record. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
