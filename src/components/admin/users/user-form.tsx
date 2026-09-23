"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { AppUser, UserRole, UserStatus, VerificationStatus } from "@/lib/mock/users";

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: "Buyer", value: "Buyer" },
  { label: "Tenant", value: "Tenant" },
  { label: "Owner", value: "Owner" },
  { label: "Broker", value: "Broker" },
  { label: "Developer", value: "Developer" },
];

const STATUS_OPTIONS: { label: string; value: UserStatus }[] = [
  { label: "Active", value: "Active" },
  { label: "Suspended", value: "Suspended" },
  { label: "Banned", value: "Banned" },
];

const VERIFICATION_OPTIONS: { label: string; value: VerificationStatus }[] = [
  { label: "Verified", value: "Verified" },
  { label: "Unverified", value: "Unverified" },
];

export interface UserFormValues {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  verification: VerificationStatus;
}

const emptyValues: UserFormValues = {
  name: "",
  email: "",
  phone: "",
  role: "Buyer",
  status: "Active",
  verification: "Unverified",
};

function label(text: string) {
  return <label className="mb-1 block text-xs font-medium text-slate-600">{text}</label>;
}

export function UserForm({
  initialValues,
  onSubmit,
  cancelHref,
  submitLabel,
}: {
  initialValues?: AppUser;
  onSubmit: (values: UserFormValues) => void;
  cancelHref: string;
  submitLabel: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<UserFormValues>(
    initialValues
      ? {
          name: initialValues.name,
          email: initialValues.email,
          phone: initialValues.phone,
          role: initialValues.role,
          status: initialValues.status,
          verification: initialValues.verification,
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
            <CardTitle>Contact details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {label("Full name")}
              <Input
                autoFocus
                required
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {label("Email")}
                <Input
                  required
                  type="email"
                  value={values.email}
                  onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                />
              </div>
              <div>
                {label("Phone")}
                <Input
                  required
                  value={values.phone}
                  onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
                  placeholder="+91 90000 00000"
                />
              </div>
            </div>
            <div>
              {label("Role — is this user a Buyer, Tenant, Owner, Broker, or Developer?")}
              <Select
                options={ROLE_OPTIONS}
                value={values.role}
                onChange={(e) => setValues((v) => ({ ...v, role: e.target.value as UserRole }))}
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
          <CardContent className="space-y-4">
            <div>
              {label("Account status")}
              <Select
                options={STATUS_OPTIONS}
                value={values.status}
                onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as UserStatus }))}
              />
            </div>
            <div>
              {label("Verification")}
              <Select
                options={VERIFICATION_OPTIONS}
                value={values.verification}
                onChange={(e) =>
                  setValues((v) => ({ ...v, verification: e.target.value as VerificationStatus }))
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
