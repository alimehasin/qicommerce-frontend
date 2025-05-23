export interface CartServerType {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  items: {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    product: {
      id: number;
      name: string;
      description: string;
      price: number;
      stock: number;
      image_path: string;
      sku: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
  }[];
}
