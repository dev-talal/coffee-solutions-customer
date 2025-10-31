import { z } from "zod";

export const addressSchema = (t: (key: string) => string) =>
  z.discriminatedUnion("is_link", [
    z.object({
      is_link: z.literal(1),
      address_link: z.string().min(1, t("address_link_required")),
    }),
    z.object({
      is_link: z.literal(0),
      short_address: z.string().min(1, t("short_address_required")),
      building_number: z.string().min(1, t("building_number_required")),
      secondary_number: z.string().min(1, t("secondary_number_required")),
      postal_code: z.string().min(1, t("postal_code_required")),
      city: z.string().min(1, t("city_required")),
      ar_short_address: z.string().min(1, t("ar_short_address_required")),
      ar_building_number: z.string().min(1, t("ar_building_number_required")),
      ar_secondary_number: z.string().min(1, t("ar_secondary_number_required")),
      ar_postal_code: z.string().min(1, t("ar_postal_code_required")),
      ar_city: z.string().min(1, t("ar_city_required")),
    }),
  ]);

export type DeliveryAddressFormData = z.infer<ReturnType<typeof addressSchema>>;
