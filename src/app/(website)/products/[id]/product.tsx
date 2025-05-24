"use client";

import { LoginForm } from "@/components/login-form";
import { Badge } from "@/components/ui/badge";
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
import type { ProductServerType } from "@/types/products";
import { constructImageUrl } from "@/utils/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function Product({
  product,
  token,
}: {
  product: ProductServerType;
  token?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.image_path);

  const { data: cart } = useQuery<CartServerType>({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return res.json();
    },
  });

  const isInCart = cart?.items.some((item) => item.product_id === product.id);
  const cartItem = cart?.items.find((item) => item.product_id === product.id);

  const addToCart = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add product to cart");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Product added to cart");
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast.error("Failed to add product to cart");
    },
  });

  const updateCartItem = useMutation({
    mutationFn: async (quantity: number) => {
      if (!cartItem) {
        return;
      }

      const url = `${env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${cartItem.id}`;
      const res = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return res.json();
    },
    onSuccess: () => {
      toast.success("Cart updated");
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast.error("Failed to update cart");
    },
  });

  const removeFromCart = useMutation({
    mutationFn: async () => {
      if (!cartItem) {
        return;
      }

      const url = `${env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${cartItem.id}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return res.json();
    },
    onSuccess: () => {
      toast.success("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast.error("Failed to remove item from cart");
    },
  });

  const handleImageSelect = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const handleKeyDown = (e: React.KeyboardEvent, imagePath: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleImageSelect(imagePath);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login to add product to cart</DialogTitle>
            <DialogDescription>
              Please login to add product to cart.
            </DialogDescription>
          </DialogHeader>

          <LoginForm
            onSuccess={() => {
              setOpen(false);
              toast.success("Logged in successfully");
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                fill
                priority
                alt={product.name}
                className="object-contain"
                src={constructImageUrl(selectedImage)}
              />
            </div>

            {product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleImageSelect(product.image_path)}
                  onKeyDown={(e) => handleKeyDown(e, product.image_path)}
                  className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden p-0 border-2 ${
                    selectedImage === product.image_path
                      ? "border-primary"
                      : "border-transparent"
                  } bg-transparent`}
                >
                  <Image
                    fill
                    alt={product.name}
                    className="object-contain p-1"
                    src={constructImageUrl(product.image_path)}
                  />
                </button>

                {product.images.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedImage === image.image_path
                        ? "border-primary"
                        : "border-transparent"
                    } bg-transparent`}
                    onClick={() => handleImageSelect(image.image_path)}
                    onKeyDown={(e) => handleKeyDown(e, image.image_path)}
                  >
                    <Image
                      fill
                      alt={product.name}
                      className="object-contain p-1"
                      src={constructImageUrl(image.image_path)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mt-2">SKU: {product.sku}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-gray-900">
                {product.price.toLocaleString()}{" "}
                <span className="text-sm text-muted-foreground">IQD</span>
              </span>
              <Badge
                variant={product.stock > 0 ? "default" : "destructive"}
                className="text-sm"
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <div className="prose prose-sm text-gray-600">
              <p>{product.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              {isInCart ? (
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() =>
                          updateCartItem.mutate((cartItem?.quantity ?? 1) - 1)
                        }
                        disabled={
                          updateCartItem.isPending ||
                          (cartItem?.quantity ?? 1) <= 1
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {cartItem?.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateCartItem.mutate((cartItem?.quantity ?? 1) + 1)
                        }
                        disabled={
                          updateCartItem.isPending ||
                          (cartItem?.quantity ?? 1) >= product.stock
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromCart.mutate()}
                      disabled={removeFromCart.isPending}
                    >
                      Remove
                    </Button>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => router.push("/cart")}
                  >
                    View Cart
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={product.stock === 0}
                  onClick={() => {
                    if (!token) {
                      setOpen(true);
                    } else {
                      addToCart.mutate();
                    }
                  }}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900">
                Product Details
              </h3>
              <dl className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900">{product.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Stock</dt>
                  <dd className="text-sm text-gray-900">
                    {product.stock} units
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
