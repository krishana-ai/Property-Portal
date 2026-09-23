"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ListingForm, type ListingFormValues } from "@/components/admin/listings/listing-form";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addListing } from "@/lib/redux/slices/listings-slice";
import { nextListingId } from "@/lib/mock/listings";

export default function NewListingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleSubmit(values: ListingFormValues) {
    const id = nextListingId();
    dispatch(
      addListing({
        ...values,
        id,
        status: "Pending",
        isActive: true,
        date: new Date().toISOString().slice(0, 10),
        documents: [],
      })
    );
    router.push(`/admin/listings/${id}`);
  }

  return (
    <div>
      <PageHeader title="Add Listing" breadcrumb={["Admin", "Listings", "Add"]} />
      <ListingForm onSubmit={handleSubmit} cancelHref="/admin/listings" submitLabel="Create listing" />
    </div>
  );
}
