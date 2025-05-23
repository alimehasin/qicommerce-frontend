"use client";

import { env } from "@/env";
import { cn } from "@/lib/utils";
import type { ProductServerType } from "@/types/products";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: ProductServerType }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group rounded-lg border shadow-sm transition-all hover:shadow-md">
        <div className="aspect-square overflow-hidden p-4">
          <Image
            src={`${env.NEXT_PUBLIC_STORAGE_BASE_URL}/${product.image_path}`}
            alt={product.name}
            width={500}
            height={500}
            className="h-full w-full object-contain transition-transform group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 className="line-clamp-2 text-lg font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold">
              ${product.price.toFixed(2)}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-xs font-medium",
                product.stock > 0
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
              )}
            >
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
