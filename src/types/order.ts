import { Product } from "./product";
import { DeliveryAddress } from "./delivery_address";

export interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  mobile_no: string;
}
export interface OrderItem {
  id: number;
  product_id: string;
  quantity: string;
  price: string;
  total: string;
  product: Product;
  product_name: Product["name"];
  product_ar_name: Product["ar_name"];
  product_image: Product["images"][0]["image"];
  unit: Product["product_unit"]["name"];
  ar_unit: Product["product_unit"]["ar_name"];
  uom_unit: Product["uom_product_unit"]["name"];
  ar_uom_unit: Product["uom_product_unit"]["ar_name"];
  product_pieces_per_box: Product["pieces_per_box"];
  product_price: Product["final_price"];
  is_box: string;
}

export interface Order extends DeliveryAddress {
  id: number;
  status: string;
  total_amount: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
  driver?: Driver;
  tax_amount: string;
  sub_total: string;
  payment_status: string;
}
