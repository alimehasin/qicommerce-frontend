import { Badge } from "@/components/ui/badge";
import type { OrderServerType } from "@/types/orders";

export function Orders({ orders }: { orders: OrderServerType }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.data.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No Orders Yet
          </h2>
          <p className="text-gray-500">
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.data.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                    <p className="text-sm text-gray-500">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge>{order.status.toUpperCase()}</Badge>

                    <p className="mt-1 text-lg font-semibold">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Order Details
                </h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">
                          Product #{item.product_id}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-500">
                      Shipping Address
                    </p>
                    <p className="mt-1">{order.shipping_address}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Contact</p>
                    <p className="mt-1">{order.phone_number}</p>
                  </div>
                  {order.note && (
                    <div className="col-span-2">
                      <p className="font-medium text-gray-500">Note</p>
                      <p className="mt-1">{order.note}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
