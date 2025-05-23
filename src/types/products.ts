export interface ProductServerType {
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
  images: {
    id: number;
    product_id: number;
    image_path: string;
    created_at: string;
    updated_at: string;
  }[];
}

export interface ProductsServerType {
  status: string;
  data: ProductServerType[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}
