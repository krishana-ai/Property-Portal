"use client";

import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ListingForm, type ListingFormValues } from "@/components/admin/listings/listing-form";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateListing } from "@/lib/redux/slices/listings-slice";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const listing = useAppSelector((state) => state.listings.items.find((l) => l.id === params.id));

  if (!listing) {
    return (
      <div>
        <PageHeader title="Listing not found" breadcrumb={["Admin", "Listings", "Edit"]} />
        <p className="text-sm text-slate-500">This listing doesn&apos;t exist or was removed.</p>
      </div>
    );
  }

  function handleSubmit(values: ListingFormValues) {
    dispatch(updateListing({ id: listing!.id, changes: values }));
    router.push(`/admin/listings/${listing!.id}`);
  }

  return (
    <div>
      <PageHeader title={`Edit Listing — ${listing.id}`} breadcrumb={["Admin", "Listings", listing.id, "Edit"]} />
      <ListingForm
        initialValues={listing}
        onSubmit={handleSubmit}
        cancelHref={`/admin/listings/${listing.id}`}
        submitLabel="Save changes"
      />
    </div>
  );
}
