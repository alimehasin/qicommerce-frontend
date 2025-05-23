"use client";

import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Login() {
  const router = useRouter();

  return (
    <LoginForm
      onSuccess={() => {
        router.push("/");
        toast.success("Login successful");
      }}
    />
  );
}
