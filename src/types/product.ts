export interface ProductCategory {
  id: number;
  name: string;
  ar_name: string;
  icon: string;
  parent: {
    id: number;
    name: string;
    ar_name: string;
    icon: string;
  };
}

export interface ProductImage {
  id: number;
  product_id: string;
  image: string;
  created_at: string;
}
export interface ProductWithId {
  id: number;
  quantity?: string;
  is_box: "0" | "1";
  product: Product;
}

export interface ProductUnit {
  id: number;
  name: string;
  ar_name: string;
}

export interface Texes {
  name: string;
  rate: string;
}

export interface Product {
  id: number;
  name: string;
  ar_name: string;
  images: ProductImage[];
  discount_percent: number;
  discount_amount: number;
  final_price: number;
  old_price: string;
  quantity: string;
  is_promotion: "0" | "1";
  description: string;
  ar_description: string;
  is_uom_small: "0" | "1";
  pieces_per_box: string;
  is_liked: boolean;
  created_at: string;
  popularity: number;
  category: ProductCategory;
  prmotion_products?: {
    id: number;
    product: Product;
    quantity: string;
  }[];
  product_unit: ProductUnit;
  uom_product_unit: ProductUnit;
  taxes: Texes[];
}

export interface ApiResponseCollection {
  product_categories: ProductCategory[];
  recent_products: Product[];
  promotions: Product[];
  popular_products: Product[];
}

export interface ApiResponseWrapper {
  data: ApiResponseCollection;
}

export interface Taxes {
  id: number;
  name: string;
  rate: string;
}

export interface Banner {
  id: number;
  url: string;
  type: string;
  category: ProductCategory;
}
