import { getToken } from "@/server/actions";
import { constructApiUrl } from "@/utils/helpers";
import type { Metadata } from "next";
import { Product } from "./product";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const productRes = await fetch(constructApiUrl(`/products/${id}`), {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!productRes.ok) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  const product = await productRes.json();

  return {
    title: `${product.name} | QiCommerce`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_path],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getToken();

  const productRes = await fetch(constructApiUrl(`/products/${id}`), {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const product = await productRes.json();

  return <Product product={product} token={token} />;
}
