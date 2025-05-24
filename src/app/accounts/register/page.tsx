"use client";

import { RegisterForm } from "@/components/register-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  return (
    <RegisterForm
      redirectPath={redirectPath}
      onSuccess={() => {
        router.push(redirectPath);
        toast.success("Register successful");
      }}
    />
  );
}
