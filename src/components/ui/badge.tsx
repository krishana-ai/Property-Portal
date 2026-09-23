import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        success: "bg-success-50 text-success-600",
        warning: "bg-warning-50 text-warning-600",
        danger: "bg-danger-50 text-danger-600",
        info: "bg-info-50 text-info-600",
        neutral: "bg-slate-100 text-slate-600",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

const STATUS_VARIANT: Record<string, NonNullable<BadgeProps["variant"]>> = {
  // Generic lifecycle
  Approved: "success",
  Active: "success",
  Verified: "success",
  Published: "success",
  Success: "success",
  Genuine: "success",
  Compliant: "success",
  Canonical: "success",
  "RERA Registered": "success",
  Sold: "success",
  Pending: "warning",
  Draft: "warning",
  "Follow-up": "warning",
  "Under Review": "warning",
  "Human Review": "warning",
  "Expiring Soon": "warning",
  Hold: "warning",
  Rejected: "danger",
  Banned: "danger",
  Suspended: "danger",
  Flagged: "danger",
  Failed: "danger",
  Spam: "danger",
  Expired: "danger",
  "Non-Compliant": "danger",
  "Duplicate Candidate": "danger",
  New: "info",
  Contacted: "info",
  Refunded: "info",
  Submitted: "info",
  Uploaded: "info",
  "AI Check": "info",
  "Duplicate Check": "info",
  "Document Check": "info",
  Updated: "info",
  Available: "info",
  Closed: "neutral",
  Merged: "neutral",
  Dismissed: "neutral",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={STATUS_VARIANT[status] ?? "neutral"}>{status}</Badge>;
}
