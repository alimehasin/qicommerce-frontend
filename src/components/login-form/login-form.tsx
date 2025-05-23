"use client";

import { env } from "@/env";
import { setToken } from "@/server/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Key } from "lucide-react";
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to login");
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

      <Button type="submit" disabled={loginMut.isPending}>
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
  );
}
