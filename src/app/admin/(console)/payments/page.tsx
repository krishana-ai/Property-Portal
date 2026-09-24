"use client";

import { useState } from "react";
import { Download, MoreHorizontal, Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StackedBarCell } from "@/components/admin/stacked-bar-cell";
import { useTableController } from "@/hooks/use-table-controller";
import { formatCurrency, formatDate } from "@/lib/utils";
import { mockPaymentTransactions, mockPaymentPlans, type Transaction, type PaymentPlan } from "@/lib/mock/payments";

function TransactionsTable() {
  const table = useTableController<Transaction>({
    data: mockPaymentTransactions,
    searchableFields: ["id", "user", "property"],
    pageSize: 8,
  });

  const columns: DataTableColumn<Transaction>[] = [
    { key: "id", header: "Txn ID", sortable: true, render: (row) => <span className="font-medium text-slate-900">{row.id}</span> },
    { key: "user", header: "User", render: (row) => row.user },
    { key: "property", header: "Property", render: (row) => row.property },
    { key: "amount", header: "Amount", sortable: true, render: (row) => row.amount },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "date", header: "Date", sortable: true, render: (row) => formatDate(row.date) },
    {
      key: "invoice",
      header: "",
      className: "w-10",
      render: () => (
        <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <Download className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
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
      emptyTitle="No transactions found"
      emptyDescription="Try adjusting your search."
    />
  );
}

function PaymentPlansTable() {
  const table = useTableController<PaymentPlan>({
    data: mockPaymentPlans,
    searchableFields: ["property", "buyer", "templateName"],
    pageSize: 8,
  });

  const columns: DataTableColumn<PaymentPlan>[] = [
    { key: "property", header: "Property", sortable: true, render: (row) => row.property },
    { key: "buyer", header: "Buyer", render: (row) => row.buyer },
    { key: "templateName", header: "Plan template", render: (row) => row.templateName },
    { key: "installments", header: "Installments", sortable: true, render: (row) => row.installments },
    {
      key: "breakdown",
      header: "Paid / Upcoming / Overdue",
      render: (row) => (
        <StackedBarCell
          segments={[
            { label: "Paid", value: row.paidAmount, colorClass: "bg-success-600" },
            { label: "Upcoming", value: row.upcomingAmount, colorClass: "bg-info-600" },
            { label: "Overdue", value: row.overdueAmount, colorClass: "bg-danger-600" },
          ]}
          width="w-36"
        />
      ),
    },
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
              <Eye className="h-3.5 w-3.5" /> View schedule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
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
      emptyTitle="No payment plans found"
      emptyDescription="Try adjusting your search."
    />
  );
}

export default function PaymentsPage() {
  const [tab, setTab] = useState("transactions");
  const totalMtd = mockPaymentTransactions
    .filter((t) => t.status === "Success")
    .reduce((sum, t) => sum + Number(t.amount.replace(/[^0-9.]/g, "")), 0);

  return (
    <div>
      <PageHeader
        title="Payments & Subscriptions"
        breadcrumb={["Admin", "Payments"]}
        action={
          <span className="text-sm text-slate-500">
            Successful this period: <span className="font-semibold text-slate-900">{formatCurrency(totalMtd)}</span>
          </span>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="plans">Payment Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <TransactionsTable />
        </TabsContent>
        <TabsContent value="plans">
          <PaymentPlansTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
