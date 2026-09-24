"use client";

import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { PropertyForm, type PropertyFormValues } from "@/components/admin/properties/property-form";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateProperty } from "@/lib/redux/slices/properties-slice";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const property = useAppSelector((state) => state.properties.items.find((p) => p.id === params.id));

  if (!property) {
    return (
      <div>
        <PageHeader title="Property not found" breadcrumb={["Admin", "Properties", "Edit"]} />
        <p className="text-sm text-slate-500">This property record doesn&apos;t exist or was removed.</p>
      </div>
    );
  }

  function handleSubmit(values: PropertyFormValues) {
    dispatch(updateProperty({ id: property!.id, changes: values }));
    router.push(`/admin/properties/${property!.id}`);
  }

  return (
    <div>
      <PageHeader
        title={`Edit Property — ${property.id}`}
        breadcrumb={["Admin", "Properties", property.id, "Edit"]}
      />
      <PropertyForm
        initialValues={property}
        onSubmit={handleSubmit}
        cancelHref={`/admin/properties/${property.id}`}
        submitLabel="Save changes"
      />
    </div>
  );
}
