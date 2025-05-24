export interface OrderServerType {
  data: {
    id: number;
    user_id: number;
    status: string;
    total_amount: number;
    shipping_address: string;
    created_at: string;
    updated_at: string;
    phone_number: string;
    note: string;
    items: {
      id: number;
      order_id: number;
      product_id: number;
      quantity: number;
      price: number;
      created_at: string;
      updated_at: string;
    }[];
  }[];
}
