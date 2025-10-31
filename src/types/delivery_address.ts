export interface DeliveryAddress {
  id: number;
  is_link: "0" | "1";
  is_linked: "0" | "1";
  short_address: string;
  ar_short_address: string;
  building_number: string;
  ar_building_number: string;
  secondary_number: string;
  ar_secondary_number: string;
  street_name: string;
  ar_street_name: string;
  district: string;
  ar_district: string;
  city: string;
  ar_city: string;
  postal_code: string;
  ar_postal_code: string;
  address_link: string;
}
