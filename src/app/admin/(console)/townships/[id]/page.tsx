"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Map, Pencil, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/use-disclosure";
import { toSqft } from "@/lib/mock/townships";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteTownship } from "@/lib/redux/slices/townships-slice";

export default function TownshipDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const township = useAppSelector((state) => state.townships.items.find((t) => t.id === params.id));
  const deleteDialog = useDisclosure();

  if (!township) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-2 text-lg font-semibold text-slate-900">Township not found</p>
        <p className="mb-4 text-sm text-slate-500">This township doesn&apos;t exist or has been removed.</p>
        <Button size="sm" onClick={() => router.push("/admin/townships")}>
          Back to Townships
        </Button>
      </div>
    );
  }

  function handleDeleteConfirmed() {
    dispatch(deleteTownship(township!.id));
    router.push("/admin/townships");
  }

  return (
    <div>
      <Link
        href="/admin/townships"
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Townships
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <ImagePlaceholder icon={Map} size="lg" />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">{township.name}</h1>
              <StatusBadge status={township.status} />
            </div>
            <p className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="font-mono text-xs text-slate-400">{township.id}</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {township.location}
              </span>
              <span>· {township.totalArea}</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/townships/${township.id}/edit`)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={deleteDialog.onOpen}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sub-projects ({township.subProjects.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {township.subProjects.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-slate-400">No sub-projects added yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {township.subProjects.map((sp, i) => (
                <li key={i} className="px-6 py-3">
                  <p className="font-medium text-slate-900">{sp.name || `Sub-project ${i + 1}`}</p>
                  <p className="text-xs text-slate-400">
                    {sp.minArea}–{sp.maxArea} {sp.unit} (≈ {toSqft(sp.minArea, sp.unit).toLocaleString()}–
                    {toSqft(sp.maxArea, sp.unit).toLocaleString()} sq.ft)
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${township.name}"?`}
        description="This will permanently remove the township and its sub-projects. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
