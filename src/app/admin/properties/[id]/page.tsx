"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Pencil,
  GitMerge,
  Trash2,
  MapPin,
  Home,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MergePropertiesDialog } from "@/components/admin/properties/merge-properties-dialog";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteProperty, mergeProperties } from "@/lib/redux/slices/properties-slice";

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const properties = useAppSelector((state) => state.properties.items);
  const property = properties.find((p) => p.id === params.id);

  const mergeDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const [statusFilter] = useState<string | null>(null);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-2 text-lg font-semibold text-slate-900">Property not found</p>
        <p className="mb-4 text-sm text-slate-500">This record doesn&apos;t exist or has been merged/removed.</p>
        <Button size="sm" onClick={() => router.push("/admin/properties")}>
          Back to Properties
        </Button>
      </div>
    );
  }

  const approvedCount = property.linkedListings.filter((l) => l.status === "Approved").length;
  const pendingCount = property.linkedListings.filter((l) => l.status === "Pending").length;
  const rejectedCount = property.linkedListings.filter((l) => l.status === "Rejected").length;

  function handleMerge(targetId: string) {
    dispatch(mergeProperties({ sourceId: property!.id, targetId }));
    router.push(`/admin/properties/${targetId}`);
  }

  function handleDeleteConfirmed() {
    dispatch(deleteProperty(property!.id));
    router.push("/admin/properties");
  }

  return (
    <div>
      <Link
        href="/admin/properties"
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Properties
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <ImagePlaceholder icon={Home} size="lg" />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">{property.address}</h1>
              <StatusBadge status={property.canonicalStatus} />
            </div>
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <span className="font-mono text-xs text-slate-400">{property.id}</span>
              <span>·</span>
              <span>{property.type}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {property.city}
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/admin/properties/${property.id}/edit`)}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="secondary" size="sm" onClick={mergeDialog.onOpen}>
            <GitMerge className="h-3.5 w-3.5" /> Merge
          </Button>
          <Button variant="destructive" size="sm" onClick={deleteDialog.onOpen}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Linked listings ({property.linkedListings.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {property.linkedListings.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-slate-400">
                  No listings are linked to this property record yet.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {property.linkedListings
                    .filter((l) => !statusFilter || l.status === statusFilter)
                    .map((listing) => (
                      <li key={listing.id} className="flex items-center gap-3 px-6 py-3.5">
                        <ImagePlaceholder icon={Building2} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">{listing.title}</p>
                          <p className="text-xs text-slate-400">
                            {listing.id} · Posted by {listing.postedBy}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-medium text-slate-700">{listing.price}</span>
                        <StatusBadge status={listing.status} />
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Key facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Layers className="h-3.5 w-3.5" /> Property type
                </span>
                <span className="font-medium text-slate-900">{property.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> City
                </span>
                <span className="font-medium text-slate-900">{property.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Canonical status
                </span>
                <StatusBadge status={property.canonicalStatus} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Listing breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Approved</span>
                <span className="font-semibold text-success-600">{approvedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Pending</span>
                <span className="font-semibold text-warning-600">{pendingCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Rejected</span>
                <span className="font-semibold text-danger-600">{rejectedCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MergePropertiesDialog
        property={property}
        candidates={properties}
        open={mergeDialog.isOpen}
        onOpenChange={(open) => (open ? mergeDialog.onOpen() : mergeDialog.onClose())}
        onMerge={handleMerge}
      />

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${property.address}"?`}
        description="This will permanently remove this property record. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
