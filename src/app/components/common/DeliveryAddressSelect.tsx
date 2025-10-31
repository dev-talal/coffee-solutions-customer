"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/providers/AddCartContext";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "@/providers/TranslationProvider";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "lucide-react/dynamic";
import { useRouter } from "nextjs-toploader/app";

const DeliveryAddressSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isRtl = locale === "ar";
  const t = useTranslation();
  const { fetchDeliveryAddress, deliveryAddress } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetchDeliveryAddress();
  }, [fetchDeliveryAddress]);

  return (
    <div className="pt-4">
      {deliveryAddress?.length > 0 ? (
        <Select
          value={value}
          onValueChange={onChange}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("select_delivery_address")} />
          </SelectTrigger>
          <SelectContent>
            {deliveryAddress.map((address) => (
              <SelectItem
                key={`address-${address.id}`}
                value={address.id.toString()}
              >
                {address.is_link == "1"
                  ? address.address_link
                  : isRtl
                  ? address.ar_short_address
                  : address.short_address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Button
          className="w-full text-lg bg-coffee-brown hover:bg-amber-400 text-white cursor-pointer"
          onClick={() => router.push(`/${locale}/profile?tab=delivery`)}
        >
          <DynamicIcon name={"map-pin"} className="w-5 h-5 text-white" />
          <span>{t("add_delivery_address")}</span>
        </Button>
      )}
    </div>
  );
};

export default DeliveryAddressSelect;
