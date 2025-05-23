"use client";

import { ProductCard } from "@/components/product-card";
import { env } from "@/env";
import type { ProductsServerType } from "@/types/products";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

export function Products() {
  const products = useInfiniteQuery<ProductsServerType>({
    initialPageParam: 1,
    queryKey: ["/api/products"],

    queryFn: async ({ pageParam = 1 }) => {
      const url = `${env.NEXT_PUBLIC_API_BASE_URL}/products?per_page=4&page=${pageParam}`;
      const res = await fetch(url);

      const data: ProductsServerType = await res.json();
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page < lastPage.meta.last_page) {
        return lastPage.meta.current_page + 1;
      }

      return undefined;
    },
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && products.hasNextPage) {
          products.fetchNextPage();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [products.fetchNextPage, products.hasNextPage],
  );

  if (products.status === "pending") {
    return <div>Loading...</div>;
  }

  if (products.status === "error") {
    return <div>Error loading products</div>;
  }

  return (
    <div className="container mx-auto p-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
      {products.data?.pages.map((page) =>
        page.data.map((product, index) => {
          const isLastProduct =
            index === page.data.length - 1 &&
            page === products.data?.pages[products.data?.pages.length - 1];

          return (
            <div
              key={product.id}
              ref={isLastProduct ? lastProductRef : undefined}
            >
              <ProductCard product={product} />
            </div>
          );
        }),
      )}

      {products.isFetchingNextPage && (
        <div className="col-span-full text-center py-4">Loading more...</div>
      )}
    </div>
  );
}
