"use client";

import { Button } from "@/components/ui/button";
import type { CartServerType } from "@/types/cart";
import { constructApiUrl } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { Menu, Package, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header({ token }: { token?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cart = useQuery({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      const cartRes = await fetch(constructApiUrl("/cart"), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!cartRes.ok) {
        return null;
      }

      const cart: CartServerType = await cartRes.json();

      return cart;
    },
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">QiCommerce</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                {cart.data?.items?.length ?? 0}
              </span>
            </Button>
          </Link>

          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <Package className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container mx-auto p-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/orders"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Orders</span>
                </div>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
