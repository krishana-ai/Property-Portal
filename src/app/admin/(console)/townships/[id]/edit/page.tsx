"use client";

import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { TownshipForm, type TownshipEditValues } from "@/components/admin/townships/township-form";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateTownship } from "@/lib/redux/slices/townships-slice";

export default function EditTownshipPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const township = useAppSelector((state) => state.townships.items.find((t) => t.id === params.id));

  if (!township) {
    return (
      <div>
        <PageHeader title="Township not found" breadcrumb={["Admin", "Townships", "Edit"]} />
        <p className="text-sm text-slate-500">This township doesn&apos;t exist or was removed.</p>
      </div>
    );
  }

  function handleSubmit(values: TownshipEditValues) {
    dispatch(updateTownship({ id: township!.id, changes: values }));
    router.push(`/admin/townships/${township!.id}`);
  }

  return (
    <div>
      <PageHeader
        title={`Edit Township — ${township.id}`}
        breadcrumb={["Admin", "Townships", township.id, "Edit"]}
      />
      <TownshipForm initialValues={township} onSubmit={handleSubmit} cancelHref={`/admin/townships/${township.id}`} />
    </div>
  );
}
