"use client";

import { useState } from "react";
import { Eye, EyeOff, RefreshCw, Pencil } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDisclosure } from "@/hooks/use-disclosure";
import {
  mockAdminRoles,
  mockNotificationTemplates,
  mockApiKeys,
  mockAuditLog,
  type AdminRoleName,
  type NotificationTemplate,
} from "@/lib/mock/settings";

const ROLE_OPTIONS: { label: string; value: AdminRoleName }[] = [
  { label: "Super Admin", value: "Super Admin" },
  { label: "Moderator", value: "Moderator" },
  { label: "Verification Officer", value: "Verification Officer" },
  { label: "Finance", value: "Finance" },
  { label: "Support", value: "Support" },
];

function RolesPanel() {
  const [rows, setRows] = useState(mockAdminRoles);

  function updateRole(id: string, role: AdminRoleName) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, role } : r)));
  }

  function togglePermission(id: string, key: keyof (typeof rows)[number]["permissions"]) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, permissions: { ...r.permissions, [key]: !r.permissions[key] } } : r))
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles & Permissions</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Approve Listings</th>
              <th className="px-4 py-3">Manage Users</th>
              <th className="px-4 py-3">View Finance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{row.name}</p>
                  <p className="text-xs text-slate-400">{row.email}</p>
                </td>
                <td className="px-4 py-3">
                  <Select
                    className="w-44"
                    options={ROLE_OPTIONS}
                    value={row.role}
                    onChange={(e) => updateRole(row.id, e.target.value as AdminRoleName)}
                  />
                </td>
                <td className="px-4 py-3">
                  <Checkbox
                    checked={row.permissions.approveListings}
                    onChange={() => togglePermission(row.id, "approveListings")}
                  />
                </td>
                <td className="px-4 py-3">
                  <Checkbox
                    checked={row.permissions.manageUsers}
                    onChange={() => togglePermission(row.id, "manageUsers")}
                  />
                </td>
                <td className="px-4 py-3">
                  <Checkbox
                    checked={row.permissions.viewFinance}
                    onChange={() => togglePermission(row.id, "viewFinance")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function NotificationTemplatesPanel() {
  const editDialog = useDisclosure();
  const [activeTemplate, setActiveTemplate] = useState<NotificationTemplate | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Templates</CardTitle>
      </CardHeader>
      <ul className="divide-y divide-slate-100">
        {mockNotificationTemplates.map((t) => (
          <li key={t.id} className="flex items-center justify-between px-6 py-3">
            <div>
              <p className="font-medium text-slate-900">{t.name}</p>
              <p className="text-xs text-slate-400">Last edited {t.lastEdited}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="neutral">{t.channel}</Badge>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setActiveTemplate(t);
                  editDialog.onOpen();
                }}
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={editDialog.isOpen} onOpenChange={(o) => (o ? editDialog.onOpen() : editDialog.onClose())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit template — {activeTemplate?.name}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <label className="mb-1 block text-xs font-medium text-slate-600">Message body</label>
            <textarea
              defaultValue={`Hi {{name}}, your ${activeTemplate?.name.toLowerCase()} update is ready.`}
              rows={5}
              className="w-full rounded-md border border-slate-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </DialogBody>
          <DialogFooter>
            <Button size="sm" onClick={editDialog.onClose}>
              Save template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function ApiKeysPanel() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
      </CardHeader>
      <ul className="divide-y divide-slate-100">
        {mockApiKeys.map((key) => (
          <li key={key.id} className="flex items-center justify-between px-6 py-3">
            <div>
              <p className="font-medium text-slate-900">{key.service}</p>
              <p className="font-mono text-xs text-slate-500">
                {revealed[key.id] ? key.maskedKey.replace(/•/g, "x") : key.maskedKey}
              </p>
              <p className="text-xs text-slate-400">Last rotated {key.lastRotated}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setRevealed((prev) => ({ ...prev, [key.id]: !prev[key.id] }))}
              >
                {revealed[key.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {revealed[key.id] ? "Hide" : "Reveal"}
              </Button>
              <Button size="sm" variant="secondary">
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function AuditLogPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
      </CardHeader>
      <ul className="divide-y divide-slate-100">
        {mockAuditLog.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between px-6 py-3 text-sm">
            <div>
              <p className="text-slate-900">
                <span className="font-medium">{entry.adminName}</span> {entry.action.toLowerCase()}{" "}
                <span className="font-medium">{entry.target}</span>
              </p>
            </div>
            <span className="shrink-0 text-xs text-slate-400">{entry.time}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState("roles");

  return (
    <div>
      <PageHeader title="Settings" breadcrumb={["Admin", "Settings"]} />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="templates">Notification Templates</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <RolesPanel />
        </TabsContent>
        <TabsContent value="templates">
          <NotificationTemplatesPanel />
        </TabsContent>
        <TabsContent value="keys">
          <ApiKeysPanel />
        </TabsContent>
        <TabsContent value="audit">
          <AuditLogPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
