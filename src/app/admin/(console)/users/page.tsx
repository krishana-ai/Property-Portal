"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MoreHorizontal, Eye, ShieldCheck, ShieldOff, Ban, Pencil, Trash2, Plus, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { Select } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTableController } from "@/hooks/use-table-controller";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatDate } from "@/lib/utils";
import { type AppUser, type UserRole } from "@/lib/mock/users";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteUser, setUserStatus, setUserVerification } from "@/lib/redux/slices/users-slice";

const TABS: { label: string; value: UserRole | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Buyers", value: "Buyer" },
  { label: "Tenants", value: "Tenant" },
  { label: "Owners", value: "Owner" },
  { label: "Brokers", value: "Broker" },
  { label: "Developers", value: "Developer" },
];

const ROLE_OPTIONS = [
  { label: "Buyer", value: "Buyer" },
  { label: "Tenant", value: "Tenant" },
  { label: "Owner", value: "Owner" },
  { label: "Broker", value: "Broker" },
  { label: "Developer", value: "Developer" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Suspended", value: "Suspended" },
  { label: "Banned", value: "Banned" },
];

const VERIFICATION_OPTIONS = [
  { label: "Verified", value: "Verified" },
  { label: "Unverified", value: "Unverified" },
];

export default function UsersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.items);
  const [activeTab, setActiveTab] = useState<UserRole | "All">("All");

  const scopedUsers = useMemo(
    () => (activeTab === "All" ? users : users.filter((u) => u.role === activeTab)),
    [users, activeTab]
  );

  const table = useTableController<AppUser>({
    data: scopedUsers,
    searchableFields: ["name", "email", "phone"],
    pageSize: 8,
  });

  const deleteDialog = useDisclosure();
  const [activeUser, setActiveUser] = useState<AppUser | null>(null);

  function openDelete(user: AppUser) {
    setActiveUser(user);
    deleteDialog.onOpen();
  }

  function handleDeleteConfirmed() {
    if (!activeUser) return;
    dispatch(deleteUser(activeUser.id));
  }

  const columns: DataTableColumn<AppUser>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <span className="font-medium text-slate-900">{row.name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email", render: (row) => row.email },
    { key: "phone", header: "Phone", render: (row) => row.phone },
    { key: "role", header: "Role", render: (row) => <Badge variant="neutral">{row.role}</Badge> },
    { key: "joined", header: "Joined", sortable: true, render: (row) => formatDate(row.joined) },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "verification",
      header: "Verification",
      render: (row) => <StatusBadge status={row.verification} />,
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
            <DropdownMenuItem onSelect={() => router.push(`/admin/users/${row.id}`)}>
              <Eye className="h-3.5 w-3.5" /> View details
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push(`/admin/users/${row.id}/edit`)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            {row.verification !== "Verified" && (
              <DropdownMenuItem
                onSelect={() => dispatch(setUserVerification({ id: row.id, verification: "Verified" }))}
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Verify
              </DropdownMenuItem>
            )}
            {row.status !== "Active" && (
              <DropdownMenuItem onSelect={() => dispatch(setUserStatus({ id: row.id, status: "Active" }))}>
                <RotateCcw className="h-3.5 w-3.5" /> Reactivate
              </DropdownMenuItem>
            )}
            {row.status !== "Suspended" && (
              <DropdownMenuItem
                destructive
                onSelect={() => dispatch(setUserStatus({ id: row.id, status: "Suspended" }))}
              >
                <ShieldOff className="h-3.5 w-3.5" /> Suspend
              </DropdownMenuItem>
            )}
            {row.status !== "Banned" && (
              <DropdownMenuItem
                destructive
                onSelect={() => dispatch(setUserStatus({ id: row.id, status: "Banned" }))}
              >
                <Ban className="h-3.5 w-3.5" /> Ban
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
        title="User Management"
        breadcrumb={["Admin", "Users"]}
        action={
          <Button size="sm" onClick={() => router.push("/admin/users/new")}>
            <Plus className="h-3.5 w-3.5" /> Add User
          </Button>
        }
      />

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as UserRole | "All");
          table.setPage(1);
        }}
      >
        <TabsList className="mb-4">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="mb-4">
            <FilterBar
              searchValue={table.search}
              onSearchChange={table.setSearch}
              searchPlaceholder="Search by name, email, or phone..."
              activeFilterCount={table.activeFilterCount}
              onClearFilters={table.clearFilters}
            >
              <Select
                className="w-32"
                options={ROLE_OPTIONS}
                placeholder="Role"
                value={table.filters.role ?? ""}
                onChange={(e) => table.setFilter("role", e.target.value)}
              />
              <Select
                className="w-40"
                options={VERIFICATION_OPTIONS}
                placeholder="Verification"
                value={table.filters.verification ?? ""}
                onChange={(e) => table.setFilter("verification", e.target.value)}
              />
              <Select
                className="w-36"
                options={STATUS_OPTIONS}
                placeholder="Account status"
                value={table.filters.status ?? ""}
                onChange={(e) => table.setFilter("status", e.target.value)}
              />
            </FilterBar>
          </div>

          <DataTable
            columns={columns}
            data={table.data}
            getRowId={(row) => row.id}
            onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
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
            emptyTitle="No users found"
            emptyDescription="Try adjusting your search or filters."
          />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${activeUser?.name ?? ""}"?`}
        description="This will permanently remove this user account. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
