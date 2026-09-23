"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type AreaUnit, type SubProject, toSqft } from "@/lib/mock/townships";

export interface TownshipFormValues {
  name: string;
  location: string;
  totalArea: string;
  subProjects: SubProject[];
}

const UNIT_OPTIONS = [
  { label: "Sq.ft", value: "Sq.ft" },
  { label: "Gaj", value: "Gaj" },
  { label: "Sq.m", value: "Sq.m" },
  { label: "Acre", value: "Acre" },
  { label: "Bigha", value: "Bigha" },
];

const STEPS = ["Basic details", "Sub-projects", "Review"];

const emptySubProject: SubProject = { name: "", unit: "Sq.ft", minArea: 0, maxArea: 0 };

export function TownshipWizard({
  onSubmit,
  cancelHref,
}: {
  onSubmit: (values: TownshipFormValues) => void;
  cancelHref: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [subProjects, setSubProjects] = useState<SubProject[]>([{ ...emptySubProject }]);
  const [saving, setSaving] = useState(false);

  function updateSubProject(index: number, patch: Partial<SubProject>) {
    setSubProjects((prev) => prev.map((sp, i) => (i === index ? { ...sp, ...patch } : sp)));
  }

  function handleCreate() {
    setSaving(true);
    onSubmit({ name, location, totalArea, subProjects });
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  done
                    ? "bg-success-600 text-white"
                    : active
                    ? "bg-primary-600 text-white"
                    : "bg-slate-100 text-slate-400"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : n}
              </div>
              <span className={cn("text-sm font-medium", active ? "text-slate-900" : "text-slate-400")}>
                {label}
              </span>
              {n < STEPS.length && <div className="h-px flex-1 bg-slate-200" />}
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step - 1]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="max-w-lg space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Township name</label>
                <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Anavrin Green City" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Location</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Sarjapur Road, Bangalore" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Total area</label>
                <Input value={totalArea} onChange={(e) => setTotalArea(e.target.value)} placeholder="e.g. 120 Acres" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Brochure</label>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 py-6 text-sm text-slate-500 hover:bg-slate-50"
                >
                  <Upload className="h-4 w-4" /> Upload brochure (PDF)
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {subProjects.map((sp, i) => {
                const minSqft = toSqft(sp.minArea, sp.unit);
                const maxSqft = toSqft(sp.maxArea, sp.unit);
                return (
                  <div key={i} className="rounded-md border border-slate-200 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-500">Sub-project {i + 1}</p>
                      {subProjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setSubProjects((prev) => prev.filter((_, idx) => idx !== i))}
                          className="cursor-pointer text-slate-400 hover:text-danger-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <Input
                        className="col-span-2 sm:col-span-1"
                        placeholder="Name"
                        value={sp.name}
                        onChange={(e) => updateSubProject(i, { name: e.target.value })}
                      />
                      <Select
                        options={UNIT_OPTIONS}
                        value={sp.unit}
                        onChange={(e) => updateSubProject(i, { unit: e.target.value as AreaUnit })}
                      />
                      <Input
                        type="number"
                        placeholder="Min area"
                        value={sp.minArea || ""}
                        onChange={(e) => updateSubProject(i, { minArea: Number(e.target.value) })}
                      />
                      <Input
                        type="number"
                        placeholder="Max area"
                        value={sp.maxArea || ""}
                        onChange={(e) => updateSubProject(i, { maxArea: Number(e.target.value) })}
                      />
                    </div>
                    {(sp.minArea > 0 || sp.maxArea > 0) && (
                      <p className="mt-2 text-xs text-slate-400">
                        ≈ {minSqft.toLocaleString()} – {maxSqft.toLocaleString()} sq.ft
                      </p>
                    )}
                  </div>
                );
              })}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSubProjects((prev) => [...prev, { ...emptySubProject }])}
              >
                <Plus className="h-3.5 w-3.5" /> Add sub-project
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Township</p>
                <p className="text-sm text-slate-900">{name || "—"}</p>
                <p className="text-xs text-slate-500">
                  {location || "—"} · {totalArea || "—"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Sub-projects ({subProjects.length})
                </p>
                <ul className="divide-y divide-slate-100 rounded-md border border-slate-200">
                  {subProjects.map((sp, i) => (
                    <li key={i} className="px-3 py-2 text-sm">
                      <span className="font-medium text-slate-900">{sp.name || `Sub-project ${i + 1}`}</span>
                      <span className="ml-2 text-xs text-slate-400">
                        {sp.minArea}–{sp.maxArea} {sp.unit} (≈ {toSqft(sp.minArea, sp.unit).toLocaleString()}–
                        {toSqft(sp.maxArea, sp.unit).toLocaleString()} sq.ft)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-5 flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() => (step > 1 ? setStep((s) => s - 1) : router.push(cancelHref))}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {step > 1 ? "Back" : "Cancel"}
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)}>
            Next <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button onClick={handleCreate} loading={saving}>
            Create Township
          </Button>
        )}
      </div>
    </div>
  );
}
