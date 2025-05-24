"use client";

import { env } from "@/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const cartSchema = z.object({
  address: z.string().min(1),
  phoneNumber: z.string().min(1),
  note: z.string().optional(),
});

export function CheckoutForm({ token }: { token?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof cartSchema>>({
    resolver: zodResolver(cartSchema),
  });

  const checkoutMutation = useMutation({
    mutationFn: async ({
      address,
      phoneNumber,
      note,
    }: {
      address: string;
      phoneNumber: string;
      note?: string;
    }) => {
      const url = `${env.NEXT_PUBLIC_API_BASE_URL}/orders/checkout`;
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          shipping_address: address,
          phone_number: phoneNumber,
          note,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Checkout successful");
      router.push("/");
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    checkoutMutation.mutate(data);
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input {...form.register("address")} placeholder="Address" />
        <Input {...form.register("phoneNumber")} placeholder="Phone Number" />
        <Textarea {...form.register("note")} placeholder="Note" />

        <Button
          type="submit"
          className="w-full"
          disabled={checkoutMutation.isPending}
        >
          {checkoutMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Checkout"
          )}
        </Button>
      </div>
    </form>
  );
}
