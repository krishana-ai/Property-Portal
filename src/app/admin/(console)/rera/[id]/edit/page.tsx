"use client";

import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ReraForm, type ReraFormValues } from "@/components/admin/rera/rera-form";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateReraRecord } from "@/lib/redux/slices/rera-slice";

export default function EditReraPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const record = useAppSelector((state) => state.rera.items.find((r) => r.id === params.id));

  if (!record) {
    return (
      <div>
        <PageHeader title="Record not found" breadcrumb={["Admin", "RERA", "Edit"]} />
        <p className="text-sm text-slate-500">This RERA record doesn&apos;t exist or was removed.</p>
      </div>
    );
  }

  function handleSubmit(values: ReraFormValues) {
    dispatch(updateReraRecord({ id: record!.id, changes: values }));
    router.push(`/admin/rera/${record!.id}`);
  }

  return (
    <div>
      <PageHeader title={`Edit RERA Record — ${record.id}`} breadcrumb={["Admin", "RERA", record.id, "Edit"]} />
      <ReraForm
        initialValues={record}
        onSubmit={handleSubmit}
        cancelHref={`/admin/rera/${record.id}`}
        submitLabel="Save changes"
      />
    </div>
  );
}
