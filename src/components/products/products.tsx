"use client";

import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import type { ProductsServerType } from "@/types/products";
import { constructApiUrl } from "@/utils/helpers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function Products() {
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const products = useInfiniteQuery<ProductsServerType>({
    initialPageParam: 1,
    queryKey: ["/api/products", includeOutOfStock, sortBy, sortDirection],

    queryFn: async ({ pageParam = 1 }) => {
      const url = constructApiUrl(
        `/products?per_page=4&page=${pageParam}&includeOutOfStock=${includeOutOfStock}&sort_by=${sortBy}&sort_direction=${sortDirection}`,
      );

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

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
    return (
      <div className="p-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (products.status === "error") {
    return <div>Error loading products</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4">
        <Select
          value={includeOutOfStock ? "true" : "false"}
          onValueChange={(value) => setIncludeOutOfStock(value === "true")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Include Out of Stock</SelectItem>
            <SelectItem value="false">In Stock Only</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortDirection}
          onValueChange={(value) => setSortDirection(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort Direction" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
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

        {products.isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={`loading-${index}`} />
          ))}
      </div>
    </div>
  );
}
