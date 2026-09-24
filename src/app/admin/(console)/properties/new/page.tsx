"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { PropertyForm, type PropertyFormValues } from "@/components/admin/properties/property-form";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addProperty } from "@/lib/redux/slices/properties-slice";
import { nextPropertyId } from "@/lib/mock/properties";

export default function NewPropertyPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleSubmit(values: PropertyFormValues) {
    const id = nextPropertyId();
    dispatch(addProperty({ id, ...values, linkedListings: [] }));
    router.push(`/admin/properties/${id}`);
  }

  return (
    <div>
      <PageHeader title="Add Property" breadcrumb={["Admin", "Properties", "Add"]} />
      <PropertyForm onSubmit={handleSubmit} cancelHref="/admin/properties" submitLabel="Create property" />
    </div>
  );
}
