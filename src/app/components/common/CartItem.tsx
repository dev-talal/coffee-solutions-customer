"uce client";

import { Button } from "@/components/ui/button";
import { formatCurrency, mergePiecesToBoxes } from "@/helpers/dataFormat";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/AddCartContext";
import { useTranslation } from "@/providers/TranslationProvider";
import { ProductWithId } from "@/types/product";
import { DynamicIcon } from "lucide-react/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import PieceBoxRadio from "./PieceBoxRadio";

const CartItem = ({
  item,
  locale,
}: {
  item: ProductWithId;
  locale: string;
}) => {
  const t = useTranslation();
  const { removeCartItem, addProductToCart, loading } = useCart();

  const [inputValue, setInputValue] = useState<string>("1");
  const [recentQuantity, setRecentQuantity] = useState<string>("1");
  const [method, setMethod] = useState<"0" | "1">("0");

  const getMaxVal = (type: "0" | "1") => {
    if (type == "0") return item.product.quantity;
    return mergePiecesToBoxes(
      Number(item.product.quantity),
      Number(item.product.pieces_per_box)
    );
  };

  const maxVal = useMemo(
    () => getMaxVal(method),
    [item.product, item.quantity, method]
  );

  const finalPrice = useMemo(() => {
    return item.is_box.toString() === "0"
      ? item.product.final_price
      : Number(item.product.pieces_per_box) * item.product.final_price;
  }, [item]);

  const oldPriceTotal = useMemo(() => {
    if (method === "0") return item.product.old_price;
    return Number(item.product.pieces_per_box) * Number(item.product.old_price);
  }, [item.product.old_price, item.product.pieces_per_box, method]);

  const updateQuantity = (val?: number, packageType?: "0" | "1") => {
    const type = packageType ?? method;
    const maxValue = Number(getMaxVal(type));

    addProductToCart({
      productId: item.product.id,
      ...(val && {
        quantity: val > maxValue ? maxValue : val,
      }),
      update: true,
      isBox: (packageType && packageType === "1") ?? method === "1",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val === "") return;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const value = Number(rawValue);
    if (value === Number(recentQuantity)) return;
    if (!rawValue || value < 1) {
      updateQuantity(value);
    } else if (value <= Number(maxVal)) {
      updateQuantity(value);
    } else if (value >= Number(maxVal)) {
      setInputValue(recentQuantity);
    }
  };

  const isRtl = locale === "ar";

  const onItemIncrement = (id: number) => {
    updateQuantity();
  };

  const onItemDecrement = (item: ProductWithId, quantity: string) => {
    if (Number(quantity) <= 1) {
      removeCartItem(item.id);
      return;
    }
    updateQuantity(Number(quantity) - 1);
  };

  const removeItem = (id: number) => {
    removeCartItem(id);
  };

  useEffect(() => {
    setInputValue(String(item.quantity));
    setRecentQuantity(String(item.quantity));
  }, [item.quantity]);

  useEffect(() => {
    setMethod(item.is_box);
  }, [item.is_box]);

  const onMethodChange = (val: "0" | "1") => {
    setMethod(() => {
      updateQuantity(Number(item.quantity), val);
      return val;
    });
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        <Button
          size="icon"
          type="button"
          className="bg-red-500/10 text-red-500 hover:bg-red-500/20 cursor-pointer"
          onClick={() => removeItem(item.id)}
          disabled={loading.isFetching}
        >
          <DynamicIcon
            name={
              loading[item.id] && loading["type"] == "remove"
                ? "loader"
                : "trash-2"
            }
            className={cn("w-5 h-5", {
              "animate-spin": loading[item.id] && loading["type"] == "remove",
            })}
          />
        </Button>
        <Link href={`/${locale}/products/${item.product.id}`}>
          <div className="flex items-center space-x-4 py-4">
            <Image
              src={item.product.images[0].image}
              alt={item.product.name}
              width={60}
              height={60}
              className="rounded-lg object-contain"
              loading="lazy"
              style={{ height: 60, width: 60 }}
            />
            <div className="w-[120px]">
              <h3 className="font-semibold line-clamp-1 break-words text-lg">
                {item.product.name}
              </h3>
              {item.product.discount_percent > 0 ? (
                <>
                  <div className="flex flex-col  justify-center space-x-4">
                    <del>
                      {formatCurrency(Number(oldPriceTotal))}&nbsp;
                      {t("sar")}
                    </del>
                    <span className="text-md font-semibold">
                      {formatCurrency(finalPrice)} {t("sar")}
                    </span>
                  </div>
                  <div className="block justify-center space-x-4">
                    <span
                      dir={isRtl ? "rtl" : "ltr"}
                      className={`flex flex-row gap-1 ${
                        isRtl ? "text-right" : "text-left"
                      }`}
                    >
                      <span className="text-red-500 font-semibold">
                        {t("discount")}
                      </span>
                      <span>{item.product.discount_percent}%</span>
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-lg font-semibold">
                  {formatCurrency(item.product.final_price)} {t("sar")}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {item.product.is_uom_small === "1" &&
        item.product?.pieces_per_box &&
        item?.product.uom_product_unit && (
          <div className="py-4">
            <PieceBoxRadio
              onChange={onMethodChange}
              isRtl={isRtl}
              value={method}
              disabled={loading.isFetching}
              perBox={item.product.pieces_per_box}
              productUnit={item.product.product_unit}
              uomUnit={item.product.uom_product_unit}
            />
          </div>
        )}
      <div className="py-4">
        <div className="flex items-center space-x-2 ">
          <div>
            <div className="flex items-center space-x-2 ">
              <Button
                size="icon"
                disabled={loading.isFetching || Number(inputValue) <= 1}
                className="rounded-full bg-coffee-brown hover:bg-amber-400 text-white"
                onClick={() => onItemDecrement(item, item.quantity ?? "1")}
              >
                <DynamicIcon
                  name={
                    loading[item.product.id] && loading["type"] == "dec"
                      ? "loader"
                      : "minus"
                  }
                  className={cn("w-4 h-4", {
                    "animate-spin":
                      loading[item.product.id] && loading["type"] == "dec",
                  })}
                />
              </Button>
              <input
                type="text"
                className="px-3 w-[55px] text-center"
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Button
                size="icon"
                onClick={() => onItemIncrement(item.product.id)}
                disabled={
                  loading.isFetching || Number(inputValue) >= Number(maxVal)
                }
                className="rounded-full bg-coffee-brown hover:bg-amber-400 text-white"
              >
                <DynamicIcon
                  name={
                    loading[item.product.id] && loading["type"] == "add"
                      ? "loader"
                      : "plus"
                  }
                  className={cn("w-4 h-4", {
                    "animate-spin":
                      loading[item.product.id] && loading["type"] == "add",
                  })}
                />
              </Button>
            </div>
            {Number(inputValue) > Number(maxVal) && (
              <p className="text-red-500 text-sm font-semibold">
                {t("available_stock")}&nbsp;{maxVal}
              </p>
            )}
          </div>
          <p className="font-semibold min-w-[150px] text-end">
            {formatCurrency(finalPrice * Number(item.quantity))}
            &nbsp;{t("sar")}
          </p>
        </div>
      </div>
    </>
  );
};

export default CartItem;
