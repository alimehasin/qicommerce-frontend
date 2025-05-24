import { getToken } from "@/server/actions";
import type { OrderServerType } from "@/types/orders";
import { constructApiUrl } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { Orders } from "./orders";

export default async function OrdersPage() {
  const token = await getToken();

  if (!token) {
    redirect("/accounts/login?redirect=/orders");
  }

  const ordersRes = await fetch(constructApiUrl("/orders"), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!ordersRes.ok) {
    redirect("/accounts/login?redirect=/orders");
  }

  const orders: OrderServerType = await ordersRes.json();

  return <Orders orders={orders} />;
}
