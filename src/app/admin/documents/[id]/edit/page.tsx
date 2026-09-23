"use client";

import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { DocumentForm, type DocumentFormValues } from "@/components/admin/documents/document-form";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateDocument } from "@/lib/redux/slices/documents-slice";

export default function EditDocumentPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const doc = useAppSelector((state) => state.documents.items.find((d) => d.id === params.id));

  if (!doc) {
    return (
      <div>
        <PageHeader title="Document not found" breadcrumb={["Admin", "Documents", "Edit"]} />
        <p className="text-sm text-slate-500">This document doesn&apos;t exist or was removed.</p>
      </div>
    );
  }

  function handleSubmit(values: DocumentFormValues) {
    dispatch(updateDocument({ id: doc!.id, changes: values }));
    router.push(`/admin/documents/${doc!.id}`);
  }

  return (
    <div>
      <PageHeader title={`Edit Document — ${doc.id}`} breadcrumb={["Admin", "Documents", doc.id, "Edit"]} />
      <DocumentForm
        initialValues={doc}
        onSubmit={handleSubmit}
        cancelHref={`/admin/documents/${doc.id}`}
        submitLabel="Save changes"
      />
    </div>
  );
}
