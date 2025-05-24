import { getToken } from "@/server/actions";
import type { CartServerType } from "@/types/cart";
import { constructApiUrl } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { Cart } from "./cart";

export default async function CartPage() {
  const token = await getToken();

  if (!token) {
    redirect("/accounts/login?redirect=/cart");
  }

  const cartRes = await fetch(constructApiUrl("/cart"), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!cartRes.ok) {
    redirect("/accounts/login?redirect=/cart");
  }

  const cart: CartServerType = await cartRes.json();

  return <Cart cart={cart} token={token} />;
}
