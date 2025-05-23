"use client";

import { ProductCard } from "@/components/product-card";
import { env } from "@/env";
import type { ProductsServerType } from "@/types/products";
import { useQuery } from "@tanstack/react-query";

export function Products() {
  const products = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/products`);
      const data: ProductsServerType = await res.json();

      return data;
    },
  });

  return (
    <div className="container mx-auto p-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
      {products.data?.data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
