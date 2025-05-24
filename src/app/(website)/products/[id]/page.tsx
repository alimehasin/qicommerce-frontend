import { env } from "@/env";
import { getToken } from "@/server/actions";
import { Product } from "./product";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getToken();

  const url = `${env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`;
  const productRes = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const product = await productRes.json();

  return <Product product={product} token={token} />;
}
