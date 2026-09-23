"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ReraRecord, ComplianceStatus } from "@/lib/mock/rera";

const COMPLIANCE_OPTIONS: { label: string; value: ComplianceStatus }[] = [
  { label: "RERA Registered", value: "RERA Registered" },
  { label: "Expiring Soon", value: "Expiring Soon" },
  { label: "Non-Compliant", value: "Non-Compliant" },
];

export interface ReraFormValues {
  projectName: string;
  reraNumber: string;
  state: string;
  validity: string;
  complianceStatus: ComplianceStatus;
}

const emptyValues: ReraFormValues = {
  projectName: "",
  reraNumber: "",
  state: "",
  validity: "",
  complianceStatus: "RERA Registered",
};

function label(text: string) {
  return <label className="mb-1 block text-xs font-medium text-slate-600">{text}</label>;
}

export function ReraForm({
  initialValues,
  onSubmit,
  cancelHref,
  submitLabel,
}: {
  initialValues?: ReraRecord;
  onSubmit: (values: ReraFormValues) => void;
  cancelHref: string;
  submitLabel: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ReraFormValues>(
    initialValues
      ? {
          projectName: initialValues.projectName,
          reraNumber: initialValues.reraNumber,
          state: initialValues.state,
          validity: initialValues.validity,
          complianceStatus: initialValues.complianceStatus,
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
            <CardTitle>Registration details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {label("Project name")}
              <Input
                autoFocus
                required
                value={values.projectName}
                onChange={(e) => setValues((v) => ({ ...v, projectName: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {label("RERA number")}
                <Input
                  required
                  value={values.reraNumber}
                  onChange={(e) => setValues((v) => ({ ...v, reraNumber: e.target.value }))}
                  placeholder="RERA/MH/2026/0000"
                />
              </div>
              <div>
                {label("State")}
                <Input
                  required
                  value={values.state}
                  onChange={(e) => setValues((v) => ({ ...v, state: e.target.value }))}
                />
              </div>
            </div>
            <div>
              {label("Valid until")}
              <Input
                required
                type="date"
                value={values.validity}
                onChange={(e) => setValues((v) => ({ ...v, validity: e.target.value }))}
              />
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
              {label("Compliance status")}
              <Select
                options={COMPLIANCE_OPTIONS}
                value={values.complianceStatus}
                onChange={(e) =>
                  setValues((v) => ({ ...v, complianceStatus: e.target.value as ComplianceStatus }))
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
