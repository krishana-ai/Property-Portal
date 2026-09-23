"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Listing, PropertyType, PostedBy } from "@/lib/mock/listings";

const TYPE_OPTIONS: { label: string; value: PropertyType }[] = [
  { label: "Apartment", value: "Apartment" },
  { label: "Villa", value: "Villa" },
  { label: "Plot", value: "Plot" },
  { label: "Commercial", value: "Commercial" },
  { label: "Office", value: "Office" },
  { label: "PG", value: "PG" },
];

const POSTED_BY_OPTIONS: { label: string; value: PostedBy }[] = [
  { label: "Owner", value: "Owner" },
  { label: "Agent", value: "Agent" },
  { label: "Builder", value: "Builder" },
];

export interface ListingFormValues {
  title: string;
  city: string;
  type: PropertyType;
  price: string;
  postedBy: PostedBy;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft: number;
  description: string;
}

const emptyValues: ListingFormValues = {
  title: "",
  city: "",
  type: "Apartment",
  price: "",
  postedBy: "Owner",
  bedrooms: undefined,
  bathrooms: undefined,
  areaSqft: 0,
  description: "",
};

function label(text: string) {
  return <label className="mb-1 block text-xs font-medium text-slate-600">{text}</label>;
}

export function ListingForm({
  initialValues,
  onSubmit,
  cancelHref,
  submitLabel,
}: {
  initialValues?: Listing;
  onSubmit: (values: ListingFormValues) => void;
  cancelHref: string;
  submitLabel: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ListingFormValues>(
    initialValues
      ? {
          title: initialValues.title,
          city: initialValues.city,
          type: initialValues.type,
          price: initialValues.price,
          postedBy: initialValues.postedBy,
          bedrooms: initialValues.bedrooms,
          bathrooms: initialValues.bathrooms,
          areaSqft: initialValues.areaSqft,
          description: initialValues.description,
        }
      : emptyValues
  );
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ListingFormValues>(key: K, value: ListingFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

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
            <CardTitle>Listing details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {label("Title")}
              <Input
                autoFocus
                required
                value={values.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. 3BHK Sea View Apartment"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                {label("Property type")}
                <Select
                  options={TYPE_OPTIONS}
                  value={values.type}
                  onChange={(e) => update("type", e.target.value as PropertyType)}
                />
              </div>
              <div>
                {label("Posted by")}
                <Select
                  options={POSTED_BY_OPTIONS}
                  value={values.postedBy}
                  onChange={(e) => update("postedBy", e.target.value as PostedBy)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                {label("City")}
                <Input
                  required
                  value={values.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="e.g. Mumbai"
                />
              </div>
              <div>
                {label("Price")}
                <Input
                  required
                  value={values.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="e.g. ₹85 L or ₹1.2 Cr"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                {label("Bedrooms")}
                <Input
                  type="number"
                  min={0}
                  value={values.bedrooms ?? ""}
                  onChange={(e) => update("bedrooms", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div>
                {label("Bathrooms")}
                <Input
                  type="number"
                  min={0}
                  value={values.bathrooms ?? ""}
                  onChange={(e) => update("bathrooms", e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div>
                {label("Area (sq.ft)")}
                <Input
                  required
                  type="number"
                  min={0}
                  value={values.areaSqft || ""}
                  onChange={(e) => update("areaSqft", Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              {label("Description")}
              <textarea
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                className="w-full rounded-md border border-slate-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Short description of the property..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Save</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500">
              New listings are created with <span className="font-medium text-slate-700">Pending</span> status
              and go through the moderation queue before appearing live.
            </p>
            <div className="flex items-center gap-2">
              <Button type="submit" className="flex-1" loading={saving}>
                <Save className="h-3.5 w-3.5" /> {submitLabel}
              </Button>
              <Button type="button" variant="secondary" onClick={() => router.push(cancelHref)}>
                <X className="h-3.5 w-3.5" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
