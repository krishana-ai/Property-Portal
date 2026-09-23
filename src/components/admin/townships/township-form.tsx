"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Township, TownshipStatus } from "@/lib/mock/townships";

const STATUS_OPTIONS: { label: string; value: TownshipStatus }[] = [
  { label: "Active", value: "Active" },
  { label: "Under Development", value: "Under Development" },
  { label: "Completed", value: "Completed" },
];

export interface TownshipEditValues {
  name: string;
  location: string;
  totalArea: string;
  status: TownshipStatus;
}

function label(text: string) {
  return <label className="mb-1 block text-xs font-medium text-slate-600">{text}</label>;
}

export function TownshipForm({
  initialValues,
  onSubmit,
  cancelHref,
}: {
  initialValues: Township;
  onSubmit: (values: TownshipEditValues) => void;
  cancelHref: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<TownshipEditValues>({
    name: initialValues.name,
    location: initialValues.location,
    totalArea: initialValues.totalArea,
    status: initialValues.status,
  });
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
            <CardTitle>Township details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {label("Township name")}
              <Input
                autoFocus
                required
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              />
            </div>
            <div>
              {label("Location")}
              <Input
                required
                value={values.location}
                onChange={(e) => setValues((v) => ({ ...v, location: e.target.value }))}
              />
            </div>
            <div>
              {label("Total area")}
              <Input
                required
                value={values.totalArea}
                onChange={(e) => setValues((v) => ({ ...v, totalArea: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            {label("Status")}
            <Select
              options={STATUS_OPTIONS}
              value={values.status}
              onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as TownshipStatus }))}
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <Button type="submit" className="flex-1" loading={saving}>
            <Save className="h-3.5 w-3.5" /> Save changes
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push(cancelHref)}>
            <X className="h-3.5 w-3.5" /> Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
