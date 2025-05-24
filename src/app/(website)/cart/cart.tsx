"use client";

import { CheckoutForm } from "@/components/checkout-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { env } from "@/env";
import type { CartServerType } from "@/types/cart";
import { constructImageUrl } from "@/utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function Cart({
  cart,
  token,
}: {
  cart: CartServerType;
  token: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const total = cart.items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const url = `${env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${itemId}`;
      const res = await fetch(url, {
        method: "DELETE",
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
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: number;
      quantity: number;
    }) => {
      const url = `${env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${itemId}`;
      const res = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
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
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Enter your delivery address to complete the checkout.
            </DialogDescription>
          </DialogHeader>

          <CheckoutForm token={token} />
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <Button asChild>
              <a href="/products">Continue Shopping</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={constructImageUrl(item.product.image_path)}
                      alt={item.product.name}
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.product.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => {
                            updateItemMutation.mutate({
                              itemId: item.id,
                              quantity: item.quantity - 1,
                            });
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            updateItemMutation.mutate({
                              itemId: item.id,
                              quantity: item.quantity + 1,
                            });
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}{" "}
                          <span className="text-sm text-muted-foreground">
                            IQD
                          </span>
                        </span>

                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={deletingItemId === item.id}
                          className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                          onClick={() => {
                            setDeletingItemId(item.id);
                            removeItemMutation.mutate(item.id, {
                              onSettled: () => setDeletingItemId(null),
                            });
                          }}
                        >
                          {deletingItemId === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      {total.toLocaleString()}{" "}
                      <span className="text-sm text-muted-foreground">IQD</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      {total.toLocaleString()}{" "}
                      <span className="text-sm text-muted-foreground">IQD</span>
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setOpen(true)}
                >
                  Proceed to Checkout
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <a href="/products">Continue Shopping</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
