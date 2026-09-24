"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectForm, type ProjectFormValues } from "@/components/admin/projects/project-form";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addProject } from "@/lib/redux/slices/projects-slice";
import { nextProjectId } from "@/lib/mock/projects";

export default function NewProjectPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleSubmit(values: ProjectFormValues) {
    const id = nextProjectId();
    dispatch(
      addProject({
        ...values,
        id,
        phases: [{ name: "Phase 1", totalUnits: values.totalUnits, sold: values.sold, available: values.available, hold: values.hold }],
      })
    );
    router.push(`/admin/projects/${id}`);
  }

  return (
    <div>
      <PageHeader title="Add Project" breadcrumb={["Admin", "Projects", "Add"]} />
      <ProjectForm onSubmit={handleSubmit} cancelHref="/admin/projects" submitLabel="Create project" />
    </div>
  );
}
