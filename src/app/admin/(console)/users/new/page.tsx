"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { UserForm, type UserFormValues } from "@/components/admin/users/user-form";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addUser } from "@/lib/redux/slices/users-slice";
import { nextUserId } from "@/lib/mock/users";

export default function NewUserPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleSubmit(values: UserFormValues) {
    const id = nextUserId();
    dispatch(addUser({ ...values, id, joined: new Date().toISOString().slice(0, 10), listingsCount: 0 }));
    router.push(`/admin/users/${id}`);
  }

  return (
    <div>
      <PageHeader title="Add User" breadcrumb={["Admin", "Users", "Add"]} />
      <UserForm onSubmit={handleSubmit} cancelHref="/admin/users" submitLabel="Create user" />
    </div>
  );
}
