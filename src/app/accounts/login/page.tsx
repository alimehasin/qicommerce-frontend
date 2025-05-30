"use client";

import { LoginForm } from "@/components/login-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  return (
    <LoginForm
      redirectPath={redirectPath}
      onSuccess={() => {
        router.push(redirectPath);
        toast.success("Login successful");
      }}
    />
  );
}
