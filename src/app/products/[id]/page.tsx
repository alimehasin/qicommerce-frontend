import { env } from "@/env";
import { Product } from "./product";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const url = `${env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`;
  const productRes = await fetch(url);
  const product = await productRes.json();

  return <Product product={product} />;
}
