"use client";

import { env } from "@/env";
import { setToken } from "@/server/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Key } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const loginMut = useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/login`, {
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
    onError: () => {
      toast.error("Invalid email or password");
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    loginMut.mutate(data);
  });

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input type="email" placeholder="Email" {...form.register("email")} />

          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
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
        </div>

        <Button type="submit" disabled={loginMut.isPending} className="w-full">
          {loginMut.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Logging in...
            </>
          ) : (
            <>
              <Key className="mr-2 h-4 w-4" />
              Login
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/accounts/register"
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
