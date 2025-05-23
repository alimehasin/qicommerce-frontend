"use client";

import type { ProductServerType } from "@/types/products";

export function ProductCard({ product }: { product: ProductServerType }) {
  return <div>{product.name}</div>;
}
