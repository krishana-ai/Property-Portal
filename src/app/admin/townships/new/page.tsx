"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { TownshipWizard, type TownshipFormValues } from "@/components/admin/townships/township-wizard";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addTownship } from "@/lib/redux/slices/townships-slice";
import { nextTownshipId } from "@/lib/mock/townships";

export default function NewTownshipPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleSubmit(values: TownshipFormValues) {
    const id = nextTownshipId();
    dispatch(
      addTownship({
        id,
        name: values.name,
        location: values.location,
        totalArea: values.totalArea,
        status: "Under Development",
        subProjects: values.subProjects.filter((sp) => sp.name.trim() !== ""),
      })
    );
    router.push(`/admin/townships/${id}`);
  }

  return (
    <div>
      <PageHeader title="Add Township" breadcrumb={["Admin", "Townships", "Add"]} />
      <TownshipWizard onSubmit={handleSubmit} cancelHref="/admin/townships" />
    </div>
  );
}
