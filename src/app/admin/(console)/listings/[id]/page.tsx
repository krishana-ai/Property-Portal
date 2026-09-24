"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Pencil,
  Trash2,
  Check,
  X,
  FileCheck2,
  FileClock,
  FileX2,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatDate } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteListing, setListingStatus } from "@/lib/redux/slices/listings-slice";

const DOC_ICON = {
  Verified: { Icon: FileCheck2, className: "text-success-600" },
  Pending: { Icon: FileClock, className: "text-warning-600" },
  Missing: { Icon: FileX2, className: "text-danger-600" },
} as const;

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const listing = useAppSelector((state) => state.listings.items.find((l) => l.id === params.id));
  const deleteDialog = useDisclosure();

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-2 text-lg font-semibold text-slate-900">Listing not found</p>
        <p className="mb-4 text-sm text-slate-500">This listing doesn&apos;t exist or has been removed.</p>
        <Button size="sm" onClick={() => router.push("/admin/listings")}>
          Back to Listings
        </Button>
      </div>
    );
  }

  function handleDeleteConfirmed() {
    dispatch(deleteListing(listing!.id));
    router.push("/admin/listings");
  }

  return (
    <div>
      <Link
        href="/admin/listings"
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Listings
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <ImagePlaceholder icon={Building2} size="lg" />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">{listing.title}</h1>
              <StatusBadge status={listing.status} />
              <StatusBadge status={listing.isActive ? "Active" : "Inactive"} />
            </div>
            <p className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
              <span className="font-mono text-xs text-slate-400">{listing.id}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {listing.city}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Submitted {formatDate(listing.date)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {listing.status !== "Rejected" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => dispatch(setListingStatus({ id: listing.id, status: "Rejected" }))}
            >
              <X className="h-3.5 w-3.5" /> Reject
            </Button>
          )}
          {listing.status !== "Approved" && (
            <Button
              size="sm"
              className="bg-success-600 text-white hover:bg-emerald-700"
              onClick={() => dispatch(setListingStatus({ id: listing.id, status: "Approved" }))}
            >
              <Check className="h-3.5 w-3.5" /> Approve
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/listings/${listing.id}/edit`)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
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
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{listing.description || "No description provided."}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification documents</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {listing.documents.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-slate-400">No documents submitted yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {listing.documents.map((doc) => {
                    const { Icon, className } = DOC_ICON[doc.status];
                    return (
                      <li key={doc.name} className="flex items-center justify-between px-6 py-3 text-sm">
                        <span className="flex items-center gap-2 text-slate-700">
                          <Icon className={`h-4 w-4 ${className}`} />
                          {doc.name}
                        </span>
                        <StatusBadge status={doc.status} />
                      </li>
                    );
                  })}
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
                <span className="text-slate-500">Type</span>
                <span className="font-medium text-slate-900">{listing.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Price</span>
                <span className="font-medium text-slate-900">{listing.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Posted by</span>
                <span className="font-medium text-slate-900">{listing.postedBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Area</span>
                <span className="font-medium text-slate-900">{listing.areaSqft} sq.ft</span>
              </div>
              {listing.bedrooms !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Beds / Baths</span>
                  <span className="font-medium text-slate-900">
                    {listing.bedrooms} / {listing.bathrooms}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${listing.title}"?`}
        description="This will permanently remove the listing. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
