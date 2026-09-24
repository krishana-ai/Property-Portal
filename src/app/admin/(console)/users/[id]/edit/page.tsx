"use client";

import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { UserForm, type UserFormValues } from "@/components/admin/users/user-form";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateUser } from "@/lib/redux/slices/users-slice";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.items.find((u) => u.id === params.id));

  if (!user) {
    return (
      <div>
        <PageHeader title="User not found" breadcrumb={["Admin", "Users", "Edit"]} />
        <p className="text-sm text-slate-500">This user doesn&apos;t exist or was removed.</p>
      </div>
    );
  }

  function handleSubmit(values: UserFormValues) {
    dispatch(updateUser({ id: user!.id, changes: values }));
    router.push(`/admin/users/${user!.id}`);
  }

  return (
    <div>
      <PageHeader title={`Edit User — ${user.id}`} breadcrumb={["Admin", "Users", user.id, "Edit"]} />
      <UserForm
        initialValues={user}
        onSubmit={handleSubmit}
        cancelHref={`/admin/users/${user.id}`}
        submitLabel="Save changes"
      />
    </div>
  );
}
