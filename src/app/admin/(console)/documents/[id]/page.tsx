"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Pencil, Trash2, Check, X, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatDate } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteDocument, setDocumentStatus } from "@/lib/redux/slices/documents-slice";

export default function DocumentDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const doc = useAppSelector((state) => state.documents.items.find((d) => d.id === params.id));
  const deleteDialog = useDisclosure();

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-2 text-lg font-semibold text-slate-900">Document not found</p>
        <p className="mb-4 text-sm text-slate-500">This document doesn&apos;t exist or has been removed.</p>
        <Button size="sm" onClick={() => router.push("/admin/documents")}>
          Back to Documents
        </Button>
      </div>
    );
  }

  function handleDeleteConfirmed() {
    dispatch(deleteDocument(doc!.id));
    router.push("/admin/documents");
  }

  return (
    <div>
      <Link
        href="/admin/documents"
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Documents
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <ImagePlaceholder icon={FileText} size="lg" />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">{doc.docType}</h1>
              <StatusBadge status={doc.status} />
            </div>
            <p className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="font-mono text-xs text-slate-400">{doc.id}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Uploaded {formatDate(doc.uploadDate)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
          {doc.status !== "Verified" && (
            <Button
              size="sm"
              className="bg-success-600 text-white hover:bg-emerald-700"
              onClick={() => dispatch(setDocumentStatus({ id: doc.id, status: "Verified" }))}
            >
              <Check className="h-3.5 w-3.5" /> Approve
            </Button>
          )}
          {doc.status !== "Rejected" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => dispatch(setDocumentStatus({ id: doc.id, status: "Rejected" }))}
            >
              <X className="h-3.5 w-3.5" /> Reject
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/documents/${doc.id}/edit`)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={deleteDialog.onOpen}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Linked entity</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-400">Entity type</p>
            <p className="font-medium text-slate-900">{doc.linkedEntityType}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Entity name</p>
            <p className="font-medium text-slate-900">{doc.linkedEntityName}</p>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${doc.docType}"?`}
        description="This will permanently remove this document record. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
