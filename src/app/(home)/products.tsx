"use client";

import { env } from "@/env";
import { useQuery } from "@tanstack/react-query";

export function Products() {
  const products = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/products`);
      const data = await res.json();

      return data;
    },
  });

  return <div>{JSON.stringify(products.data)}</div>;
}
