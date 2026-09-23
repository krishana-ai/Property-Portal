"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { DocumentForm, type DocumentFormValues } from "@/components/admin/documents/document-form";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addDocument } from "@/lib/redux/slices/documents-slice";
import { nextDocumentId } from "@/lib/mock/documents";

export default function NewDocumentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleSubmit(values: DocumentFormValues) {
    const id = nextDocumentId();
    dispatch(addDocument({ ...values, id, uploadDate: new Date().toISOString().slice(0, 10) }));
    router.push(`/admin/documents/${id}`);
  }

  return (
    <div>
      <PageHeader title="Add Document" breadcrumb={["Admin", "Documents", "Add"]} />
      <DocumentForm onSubmit={handleSubmit} cancelHref="/admin/documents" submitLabel="Add document" />
    </div>
  );
}
