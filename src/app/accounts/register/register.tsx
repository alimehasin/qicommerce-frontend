"use client";

import { RegisterForm } from "@/components/register-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  return (
    <RegisterForm
      onSuccess={() => {
        router.push(redirectPath);
        toast.success("Register successful");
      }}
    />
  );
}
