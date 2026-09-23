"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Scale, Pencil, Trash2, ShieldCheck, Flag, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatDate } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteReraRecord, setReraCompliance } from "@/lib/redux/slices/rera-slice";

export default function ReraDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const record = useAppSelector((state) => state.rera.items.find((r) => r.id === params.id));
  const deleteDialog = useDisclosure();

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-2 text-lg font-semibold text-slate-900">Record not found</p>
        <p className="mb-4 text-sm text-slate-500">This RERA record doesn&apos;t exist or has been removed.</p>
        <Button size="sm" onClick={() => router.push("/admin/rera")}>
          Back to RERA
        </Button>
      </div>
    );
  }

  function handleDeleteConfirmed() {
    dispatch(deleteReraRecord(record!.id));
    router.push("/admin/rera");
  }

  return (
    <div>
      <Link
        href="/admin/rera"
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to RERA
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <ImagePlaceholder icon={Scale} size="lg" />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">{record.projectName}</h1>
              <StatusBadge status={record.complianceStatus} />
            </div>
            <p className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="font-mono text-xs text-slate-400">{record.reraNumber}</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {record.state}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Valid until {formatDate(record.validity)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {record.complianceStatus !== "RERA Registered" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => dispatch(setReraCompliance({ id: record.id, complianceStatus: "RERA Registered" }))}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Verify
            </Button>
          )}
          {record.complianceStatus !== "Non-Compliant" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => dispatch(setReraCompliance({ id: record.id, complianceStatus: "Non-Compliant" }))}
            >
              <Flag className="h-3.5 w-3.5" /> Flag
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/rera/${record.id}/edit`)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={deleteDialog.onOpen}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registration details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-400">RERA number</p>
            <p className="font-medium text-slate-900">{record.reraNumber}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">State</p>
            <p className="font-medium text-slate-900">{record.state}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Valid until</p>
            <p className="font-medium text-slate-900">{formatDate(record.validity)}</p>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${record.projectName}"?`}
        description="This will permanently remove this RERA record. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
