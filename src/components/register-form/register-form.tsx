"use client";
import { setToken } from "@/server/actions";
import { constructApiUrl } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Key } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const registerSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    password_confirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

export function RegisterForm({
  onSuccess,
  redirectPath,
}: {
  onSuccess: () => void;
  redirectPath?: string;
}) {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const registerMut = useMutation({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      const res = await fetch(constructApiUrl("/register"), {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      return res.json();
    },
    onSuccess: async (data) => {
      await setToken(data.token);

      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    registerMut.mutate(data);
  });

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input type="text" placeholder="Name" {...form.register("name")} />

          {form.formState.errors.name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}

          <Input type="email" placeholder="Email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}

          <Input
            type="password"
            placeholder="Password"
            {...form.register("password")}
          />

          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}

          <Input
            type="password"
            placeholder="Password Confirmation"
            {...form.register("password_confirmation")}
          />

          {form.formState.errors.password_confirmation && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password_confirmation.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={registerMut.isPending}
          className="w-full"
        >
          {registerMut.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Registering...
            </>
          ) : (
            <>
              <Key className="mr-2 h-4 w-4" />
              Register
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={`/accounts/login?redirect=${redirectPath}`}
          className="text-primary hover:underline font-medium"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
