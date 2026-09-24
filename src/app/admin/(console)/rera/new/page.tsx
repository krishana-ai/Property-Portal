"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ReraForm, type ReraFormValues } from "@/components/admin/rera/rera-form";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addReraRecord } from "@/lib/redux/slices/rera-slice";
import { nextReraId } from "@/lib/mock/rera";

export default function NewReraPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleSubmit(values: ReraFormValues) {
    const id = nextReraId();
    dispatch(addReraRecord({ ...values, id }));
    router.push(`/admin/rera/${id}`);
  }

  return (
    <div>
      <PageHeader title="Add RERA Record" breadcrumb={["Admin", "RERA", "Add"]} />
      <ReraForm onSubmit={handleSubmit} cancelHref="/admin/rera" submitLabel="Add record" />
    </div>
  );
}
