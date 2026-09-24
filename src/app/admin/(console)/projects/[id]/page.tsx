"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building, Pencil, Trash2, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StackedBarCell } from "@/components/admin/stacked-bar-cell";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { deleteProject } from "@/lib/redux/slices/projects-slice";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.projects.items.find((p) => p.id === params.id));
  const deleteDialog = useDisclosure();

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-2 text-lg font-semibold text-slate-900">Project not found</p>
        <p className="mb-4 text-sm text-slate-500">This project doesn&apos;t exist or has been removed.</p>
        <Button size="sm" onClick={() => router.push("/admin/projects")}>
          Back to Projects
        </Button>
      </div>
    );
  }

  function handleDeleteConfirmed() {
    dispatch(deleteProject(project!.id));
    router.push("/admin/projects");
  }

  return (
    <div>
      <Link
        href="/admin/projects"
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <ImagePlaceholder icon={Building} size="lg" />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">{project.name}</h1>
              <StatusBadge status={project.reraStatus} />
            </div>
            <p className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="font-mono text-xs text-slate-400">{project.id}</span>
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> {project.developer}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {project.city}
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/projects/${project.id}/edit`)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={deleteDialog.onOpen}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Phase-wise inventory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-2.5">Phase</th>
                    <th className="px-6 py-2.5">Total Units</th>
                    <th className="px-6 py-2.5">Breakdown</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {project.phases.map((phase) => (
                    <tr key={phase.name}>
                      <td className="px-6 py-3 font-medium text-slate-900">{phase.name}</td>
                      <td className="px-6 py-3 text-slate-700">{phase.totalUnits}</td>
                      <td className="px-6 py-3">
                        <StackedBarCell
                          segments={[
                            { label: "Sold", value: phase.sold, colorClass: "bg-success-600" },
                            { label: "Available", value: phase.available, colorClass: "bg-info-600" },
                            { label: "Hold", value: phase.hold, colorClass: "bg-warning-600" },
                          ]}
                          width="w-40"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Overall inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total units</span>
                <span className="font-medium text-slate-900">{project.totalUnits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Sold</span>
                <span className="font-semibold text-success-600">{project.sold}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Available</span>
                <span className="font-semibold text-info-600">{project.available}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">On hold</span>
                <span className="font-semibold text-warning-600">{project.hold}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => (open ? deleteDialog.onOpen() : deleteDialog.onClose())}
        title={`Delete "${project.name}"?`}
        description="This will permanently remove this project and its phase data. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
