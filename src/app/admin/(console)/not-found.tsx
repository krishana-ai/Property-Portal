import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <SearchX className="h-7 w-7 text-slate-400" />
      </div>
      <p className="mt-4 text-3xl font-semibold text-slate-900">404</p>
      <p className="mt-1 text-sm text-slate-500">
        This admin page doesn&apos;t exist or may have been moved.
      </p>
      <Link href="/admin" className={buttonVariants({ size: "sm", className: "mt-6" })}>
        Back to Dashboard
      </Link>
    </div>
  );
}
