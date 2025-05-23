"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">QiCommerce</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/products"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Categories
          </Link>
          <Link
            href="/deals"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Deals
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-[200px]"
            />
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              0
            </span>
          </Button>

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
            <div className="flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Search products..."
                className="flex-1"
              />
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/deals"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
