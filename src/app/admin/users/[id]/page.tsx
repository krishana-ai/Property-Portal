"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ShieldCheck,
  ShieldOff,
  Ban,
  RotateCcw,
  Mail,
  Phone,
  Calendar,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatDate } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteUser, setUserStatus, setUserVerification } from "@/lib/redux/slices/users-slice";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.items.find((u) => u.id === params.id));
  const deleteDialog = useDisclosure();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-2 text-lg font-semibold text-slate-900">User not found</p>
        <p className="mb-4 text-sm text-slate-500">This account doesn&apos;t exist or has been removed.</p>
        <Button size="sm" onClick={() => router.push("/admin/users")}>
          Back to Users
        </Button>
      </div>
    );
  }

  function handleDeleteConfirmed() {
    dispatch(deleteUser(user!.id));
    router.push("/admin/users");
  }

  return (
    <div>
      <Link
        href="/admin/users"
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Users
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Avatar name={user.name} size="md" />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">{user.name}</h1>
              <Badge variant="neutral">{user.role}</Badge>
              <StatusBadge status={user.status} />
              <StatusBadge status={user.verification} />
            </div>
            <p className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {user.phone}
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {user.verification !== "Verified" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => dispatch(setUserVerification({ id: user.id, verification: "Verified" }))}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Verify
            </Button>
          )}
          {user.status !== "Active" ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => dispatch(setUserStatus({ id: user.id, status: "Active" }))}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reactivate
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => dispatch(setUserStatus({ id: user.id, status: "Suspended" }))}
            >
              <ShieldOff className="h-3.5 w-3.5" /> Suspend
            </Button>
          )}
          {user.status !== "Banned" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => dispatch(setUserStatus({ id: user.id, status: "Banned" }))}
            >
              <Ban className="h-3.5 w-3.5" /> Ban
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={deleteDialog.onOpen}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <Building2 className="h-4 w-4 text-slate-400" />
                {user.listingsCount} listing{user.listingsCount === 1 ? "" : "s"} posted on the platform
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">User ID</span>
                <span className="font-mono text-xs text-slate-700">{user.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="h-3.5 w-3.5" /> Joined
                </span>
                <span className="font-medium text-slate-900">{formatDate(user.joined)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${user.name}"?`}
        description="This will permanently remove this user account. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
