"use client";

import { useState } from "react";
import { Phone, MessageCircle, MessageSquare, PhoneForwarded, Download, MoreHorizontal, Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { FilterBar } from "@/components/ui/filter-bar";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge, StatusBadge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTableController } from "@/hooks/use-table-controller";
import { exportToCsv, formatDate } from "@/lib/utils";
import { mockLeads, type Lead, type LeadChannel } from "@/lib/mock/leads";

const CHANNEL_ICON: Record<LeadChannel, typeof Phone> = {
  Call: Phone,
  WhatsApp: MessageCircle,
  Chat: MessageSquare,
  Callback: PhoneForwarded,
};

const CHANNEL_OPTIONS = [
  { label: "Call", value: "Call" },
  { label: "WhatsApp", value: "WhatsApp" },
  { label: "Chat", value: "Chat" },
  { label: "Callback", value: "Callback" },
];

const QUALITY_OPTIONS = [
  { label: "Genuine", value: "Genuine" },
  { label: "Spam", value: "Spam" },
];

const USER_TYPE_OPTIONS = [
  { label: "Buyer", value: "Buyer" },
  { label: "Broker", value: "Broker" },
  { label: "Developer", value: "Developer" },
];

export default function LeadsPage() {
  const table = useTableController<Lead>({
    data: mockLeads,
    searchableFields: ["userName", "listingOrProject"],
    pageSize: 8,
  });
  const [dateRange, setDateRange] = useState("Last 30 days");

  const columns: DataTableColumn<Lead>[] = [
    { key: "userName", header: "User", sortable: true, render: (row) => <span className="font-medium text-slate-900">{row.userName}</span> },
    { key: "listingOrProject", header: "Listing / Project", render: (row) => row.listingOrProject },
    {
      key: "channel",
      header: "Channel",
      render: (row) => {
        const Icon = CHANNEL_ICON[row.channel];
        return (
          <span className="flex items-center gap-1.5 text-slate-600">
            <Icon className="h-3.5 w-3.5 text-slate-400" /> {row.channel}
          </span>
        );
      },
    },
    { key: "userType", header: "Type", render: (row) => <Badge variant="neutral">{row.userType}</Badge> },
    { key: "quality", header: "Quality", render: (row) => <StatusBadge status={row.quality} /> },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "date", header: "Date", sortable: true, render: (row) => formatDate(row.date) },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Eye className="h-3.5 w-3.5" /> View details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Leads & Enquiries"
        breadcrumb={["Admin", "Leads"]}
        action={
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              exportToCsv(
                "leads.csv",
                table.data.map((l) => ({
                  id: l.id,
                  user: l.userName,
                  listingOrProject: l.listingOrProject,
                  channel: l.channel,
                  quality: l.quality,
                  userType: l.userType,
                  status: l.status,
                  date: l.date,
                }))
              )
            }
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        }
      />

      <div className="mb-4">
        <FilterBar
          searchValue={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search by user or listing..."
          activeFilterCount={table.activeFilterCount}
          onClearFilters={table.clearFilters}
        >
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Select
            className="w-32"
            options={CHANNEL_OPTIONS}
            placeholder="Channel"
            value={table.filters.channel ?? ""}
            onChange={(e) => table.setFilter("channel", e.target.value)}
          />
          <Select
            className="w-32"
            options={QUALITY_OPTIONS}
            placeholder="Quality"
            value={table.filters.quality ?? ""}
            onChange={(e) => table.setFilter("quality", e.target.value)}
          />
          <Select
            className="w-36"
            options={USER_TYPE_OPTIONS}
            placeholder="User type"
            value={table.filters.userType ?? ""}
            onChange={(e) => table.setFilter("userType", e.target.value)}
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
        emptyTitle="No leads found"
        emptyDescription="Try adjusting your search or filters."
      />
    </div>
  );
}
