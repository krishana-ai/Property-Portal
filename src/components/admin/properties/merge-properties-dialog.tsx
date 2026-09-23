"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { CanonicalProperty } from "@/lib/mock/properties";

export function MergePropertiesDialog({
  property,
  candidates,
  open,
  onOpenChange,
  onMerge,
}: {
  property: CanonicalProperty | null;
  candidates: CanonicalProperty[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMerge: (targetId: string) => void;
}) {
  const [targetId, setTargetId] = useState("");

  if (!property) return null;

  const options = candidates
    .filter((c) => c.id !== property.id)
    .map((c) => ({ label: `${c.address} (${c.id})`, value: c.id }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Merge &quot;{property.address}&quot;</DialogTitle>
          <DialogDescription>
            Choose the property record to merge this into. All linked listings from{" "}
            <span className="font-medium">{property.id}</span> will move to the target, and this record will be
            removed.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <label className="mb-1 block text-xs font-medium text-slate-600">Merge into</label>
          <Select
            options={options}
            placeholder="Select target property"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!targetId}
            onClick={() => {
              if (!targetId) return;
              onMerge(targetId);
              onOpenChange(false);
            }}
          >
            Merge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
