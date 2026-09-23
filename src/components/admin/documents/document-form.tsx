"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { DocumentRecord, LinkedEntityType, DocumentStatus } from "@/lib/mock/documents";

const ENTITY_OPTIONS: { label: string; value: LinkedEntityType }[] = [
  { label: "User", value: "User" },
  { label: "Listing", value: "Listing" },
  { label: "Project", value: "Project" },
];

const STATUS_OPTIONS: { label: string; value: DocumentStatus }[] = [
  { label: "Uploaded", value: "Uploaded" },
  { label: "Under Review", value: "Under Review" },
  { label: "Verified", value: "Verified" },
  { label: "Rejected", value: "Rejected" },
];

export interface DocumentFormValues {
  docType: string;
  linkedEntityType: LinkedEntityType;
  linkedEntityName: string;
  status: DocumentStatus;
}

const emptyValues: DocumentFormValues = {
  docType: "",
  linkedEntityType: "Listing",
  linkedEntityName: "",
  status: "Uploaded",
};

function label(text: string) {
  return <label className="mb-1 block text-xs font-medium text-slate-600">{text}</label>;
}

export function DocumentForm({
  initialValues,
  onSubmit,
  cancelHref,
  submitLabel,
}: {
  initialValues?: DocumentRecord;
  onSubmit: (values: DocumentFormValues) => void;
  cancelHref: string;
  submitLabel: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(initialValues);
  const [values, setValues] = useState<DocumentFormValues>(
    initialValues
      ? {
          docType: initialValues.docType,
          linkedEntityType: initialValues.linkedEntityType,
          linkedEntityName: initialValues.linkedEntityName,
          status: initialValues.status,
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
            <CardTitle>Document details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {label("Document type")}
              <Input
                autoFocus
                required
                value={values.docType}
                onChange={(e) => setValues((v) => ({ ...v, docType: e.target.value }))}
                placeholder="e.g. Sale Deed, RERA Certificate"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {label("Linked entity type")}
                <Select
                  options={ENTITY_OPTIONS}
                  value={values.linkedEntityType}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, linkedEntityType: e.target.value as LinkedEntityType }))
                  }
                />
              </div>
              <div>
                {label("Linked entity name")}
                <Input
                  required
                  value={values.linkedEntityName}
                  onChange={(e) => setValues((v) => ({ ...v, linkedEntityName: e.target.value }))}
                  placeholder="e.g. 3BHK Sea View Apartment"
                />
              </div>
            </div>
            {!isEdit && (
              <div>
                {label("File")}
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 py-6 text-sm text-slate-500 hover:bg-slate-50"
                >
                  <Upload className="h-4 w-4" /> Upload file (PDF/JPG/PNG)
                </button>
              </div>
            )}
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
              {label("Status")}
              <Select
                options={STATUS_OPTIONS}
                value={values.status}
                onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as DocumentStatus }))}
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
