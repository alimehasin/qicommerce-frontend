import { getToken } from "@/server/actions";
import { constructApiUrl } from "@/utils/helpers";
import { Product } from "./product";

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
