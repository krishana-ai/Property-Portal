"use client";

import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectForm, type ProjectFormValues } from "@/components/admin/projects/project-form";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateProject } from "@/lib/redux/slices/projects-slice";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.projects.items.find((p) => p.id === params.id));

  if (!project) {
    return (
      <div>
        <PageHeader title="Project not found" breadcrumb={["Admin", "Projects", "Edit"]} />
        <p className="text-sm text-slate-500">This project doesn&apos;t exist or was removed.</p>
      </div>
    );
  }

  function handleSubmit(values: ProjectFormValues) {
    dispatch(updateProject({ id: project!.id, changes: values }));
    router.push(`/admin/projects/${project!.id}`);
  }

  return (
    <div>
      <PageHeader title={`Edit Project — ${project.id}`} breadcrumb={["Admin", "Projects", project.id, "Edit"]} />
      <ProjectForm
        initialValues={project}
        onSubmit={handleSubmit}
        cancelHref={`/admin/projects/${project.id}`}
        submitLabel="Save changes"
      />
    </div>
  );
}
