"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CanonicalProperty, PropertyType, CanonicalStatus } from "@/lib/mock/properties";

const TYPE_OPTIONS: { label: string; value: PropertyType }[] = [
  { label: "Apartment", value: "Apartment" },
  { label: "Villa", value: "Villa" },
  { label: "Plot", value: "Plot" },
  { label: "Commercial", value: "Commercial" },
  { label: "Office", value: "Office" },
  { label: "PG", value: "PG" },
];

const STATUS_OPTIONS: { label: string; value: CanonicalStatus }[] = [
  { label: "Canonical", value: "Canonical" },
  { label: "Under Review", value: "Under Review" },
  { label: "Duplicate Candidate", value: "Duplicate Candidate" },
];

export interface PropertyFormValues {
  address: string;
  type: PropertyType;
  city: string;
  canonicalStatus: CanonicalStatus;
}

const emptyValues: PropertyFormValues = {
  address: "",
  type: "Apartment",
  city: "",
  canonicalStatus: "Under Review",
};

function label(text: string, hint?: string) {
  return (
    <label className="mb-1 block text-xs font-medium text-slate-600">
      {text} {hint && <span className="font-normal text-slate-400">({hint})</span>}
    </label>
  );
}

export function PropertyForm({
  initialValues,
  onSubmit,
  cancelHref,
  submitLabel,
}: {
  initialValues?: CanonicalProperty;
  onSubmit: (values: PropertyFormValues) => void;
  cancelHref: string;
  submitLabel: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PropertyFormValues>(
    initialValues
      ? {
          address: initialValues.address,
          type: initialValues.type,
          city: initialValues.city,
          canonicalStatus: initialValues.canonicalStatus,
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
            <CardTitle>Property details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {label("Address")}
              <Input
                autoFocus
                required
                value={values.address}
                onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
                placeholder="e.g. Sunrise Towers, Bandra West"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {label("Property type")}
                <Select
                  options={TYPE_OPTIONS}
                  value={values.type}
                  onChange={(e) => setValues((v) => ({ ...v, type: e.target.value as PropertyType }))}
                />
              </div>
              <div>
                {label("City")}
                <Input
                  required
                  value={values.city}
                  onChange={(e) => setValues((v) => ({ ...v, city: e.target.value }))}
                  placeholder="e.g. Mumbai"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {label("Canonical status", "de-duplication")}
              <Select
                options={STATUS_OPTIONS}
                value={values.canonicalStatus}
                onChange={(e) =>
                  setValues((v) => ({ ...v, canonicalStatus: e.target.value as CanonicalStatus }))
                }
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
