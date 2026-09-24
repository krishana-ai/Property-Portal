"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building, MoreHorizontal, Eye, Pencil, Trash2, Plus } from "lucide-react";
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
import { StackedBarCell } from "@/components/admin/stacked-bar-cell";
import { useTableController } from "@/hooks/use-table-controller";
import { useDisclosure } from "@/hooks/use-disclosure";
import { type Project } from "@/lib/mock/projects";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteProject } from "@/lib/redux/slices/projects-slice";

const RERA_OPTIONS = [
  { label: "RERA Registered", value: "RERA Registered" },
  { label: "Pending", value: "Pending" },
  { label: "Non-Compliant", value: "Non-Compliant" },
];

export default function ProjectsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.items);

  const table = useTableController<Project>({
    data: projects,
    searchableFields: ["name", "developer", "city"],
    pageSize: 8,
  });

  const deleteDialog = useDisclosure();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  function openDelete(project: Project) {
    setActiveProject(project);
    deleteDialog.onOpen();
  }

  function handleDeleteConfirmed() {
    if (!activeProject) return;
    dispatch(deleteProject(activeProject.id));
  }

  const columns: DataTableColumn<Project>[] = [
    {
      key: "name",
      header: "Project",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <ImagePlaceholder icon={Building} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-400">{row.id}</p>
          </div>
        </div>
      ),
    },
    { key: "developer", header: "Developer", sortable: true, render: (row) => row.developer },
    { key: "city", header: "City", sortable: true, render: (row) => row.city },
    { key: "totalUnits", header: "Total Units", sortable: true, render: (row) => row.totalUnits },
    {
      key: "breakdown",
      header: "Sold / Available / Hold",
      render: (row) => (
        <StackedBarCell
          segments={[
            { label: "Sold", value: row.sold, colorClass: "bg-success-600" },
            { label: "Avail", value: row.available, colorClass: "bg-info-600" },
            { label: "Hold", value: row.hold, colorClass: "bg-warning-600" },
          ]}
        />
      ),
    },
    { key: "reraStatus", header: "RERA Status", render: (row) => <StatusBadge status={row.reraStatus} /> },
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
            <DropdownMenuItem onSelect={() => router.push(`/admin/projects/${row.id}`)}>
              <Eye className="h-3.5 w-3.5" /> View phases
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push(`/admin/projects/${row.id}/edit`)}>
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
        title="Developer Projects"
        breadcrumb={["Admin", "Projects"]}
        action={
          <Button size="sm" onClick={() => router.push("/admin/projects/new")}>
            <Plus className="h-3.5 w-3.5" /> Add Project
          </Button>
        }
      />

      <div className="mb-4">
        <FilterBar
          searchValue={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search by project, developer, or city..."
          activeFilterCount={table.activeFilterCount}
          onClearFilters={table.clearFilters}
        >
          <Select
            className="w-40"
            options={RERA_OPTIONS}
            placeholder="RERA status"
            value={table.filters.reraStatus ?? ""}
            onChange={(e) => table.setFilter("reraStatus", e.target.value)}
          />
        </FilterBar>
      </div>

      <DataTable
        columns={columns}
        data={table.data}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/projects/${row.id}`)}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        page={table.page}
        pageSize={table.pageSize}
        total={table.total}
        onPageChange={table.setPage}
        emptyTitle="No projects found"
        emptyDescription="Try adjusting your search or filters."
      />

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${activeProject?.name ?? ""}"?`}
        description="This will permanently remove this project and its phase data. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
