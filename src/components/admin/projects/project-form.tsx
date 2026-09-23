"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Project, ReraStatus } from "@/lib/mock/projects";

const RERA_OPTIONS: { label: string; value: ReraStatus }[] = [
  { label: "RERA Registered", value: "RERA Registered" },
  { label: "Pending", value: "Pending" },
  { label: "Non-Compliant", value: "Non-Compliant" },
];

export interface ProjectFormValues {
  name: string;
  developer: string;
  city: string;
  totalUnits: number;
  sold: number;
  available: number;
  hold: number;
  reraStatus: ReraStatus;
}

const emptyValues: ProjectFormValues = {
  name: "",
  developer: "",
  city: "",
  totalUnits: 0,
  sold: 0,
  available: 0,
  hold: 0,
  reraStatus: "Pending",
};

function label(text: string) {
  return <label className="mb-1 block text-xs font-medium text-slate-600">{text}</label>;
}

export function ProjectForm({
  initialValues,
  onSubmit,
  cancelHref,
  submitLabel,
}: {
  initialValues?: Project;
  onSubmit: (values: ProjectFormValues) => void;
  cancelHref: string;
  submitLabel: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProjectFormValues>(
    initialValues
      ? {
          name: initialValues.name,
          developer: initialValues.developer,
          city: initialValues.city,
          totalUnits: initialValues.totalUnits,
          sold: initialValues.sold,
          available: initialValues.available,
          hold: initialValues.hold,
          reraStatus: initialValues.reraStatus,
        }
      : emptyValues
  );
  const [saving, setSaving] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Project details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {label("Project name")}
              <Input
                autoFocus
                required
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {label("Developer")}
                <Input
                  required
                  value={values.developer}
                  onChange={(e) => setValues((v) => ({ ...v, developer: e.target.value }))}
                />
              </div>
              <div>
                {label("City")}
                <Input
                  required
                  value={values.city}
                  onChange={(e) => setValues((v) => ({ ...v, city: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                {label("Total units")}
                <Input
                  required
                  type="number"
                  min={0}
                  value={values.totalUnits || ""}
                  onChange={(e) => setValues((v) => ({ ...v, totalUnits: Number(e.target.value) }))}
                />
              </div>
              <div>
                {label("Sold")}
                <Input
                  type="number"
                  min={0}
                  value={values.sold || ""}
                  onChange={(e) => setValues((v) => ({ ...v, sold: Number(e.target.value) }))}
                />
              </div>
              <div>
                {label("Available")}
                <Input
                  type="number"
                  min={0}
                  value={values.available || ""}
                  onChange={(e) => setValues((v) => ({ ...v, available: Number(e.target.value) }))}
                />
              </div>
              <div>
                {label("Hold")}
                <Input
                  type="number"
                  min={0}
                  value={values.hold || ""}
                  onChange={(e) => setValues((v) => ({ ...v, hold: Number(e.target.value) }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {label("RERA status")}
              <Select
                options={RERA_OPTIONS}
                value={values.reraStatus}
                onChange={(e) => setValues((v) => ({ ...v, reraStatus: e.target.value as ReraStatus }))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <Button type="submit" className="flex-1" loading={saving}>
            <Save className="h-3.5 w-3.5" /> {submitLabel}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push(cancelHref)}>
            <X className="h-3.5 w-3.5" /> Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
