"use client";
import { constructApiUrl } from "@/utils/helpers";
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
  address: z.string().min(1, "Address is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^07[0-9]{9}$/,
      "Please enter a valid Iraqi phone number (e.g., 07x xxx xxxx)",
    ),
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
      const res = await fetch(constructApiUrl("/orders/checkout"), {
        method: "POST",
        body: JSON.stringify({
          shipping_address: address,
          phone_number: phoneNumber,
          note,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
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
        <div>
          <Input {...form.register("address")} placeholder="Address" />
          {form.formState.errors.address && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.address.message}
            </p>
          )}
        </div>

        <div>
          <Input {...form.register("phoneNumber")} placeholder="Phone Number" />
          {form.formState.errors.phoneNumber && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div>
          <Textarea {...form.register("note")} placeholder="Note" />
          {form.formState.errors.note && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.note.message}
            </p>
          )}
        </div>

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
