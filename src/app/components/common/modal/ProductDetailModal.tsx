"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ProductImageProvider,
  useProductImage,
} from "@/providers/ProductImageProvider";
import { useTranslation } from "@/providers/TranslationProvider";
import { Product } from "@/types/product";
import Image from "next/image";
import { formatCurrency, mergePiecesToBoxes } from "@/helpers/dataFormat";
import { useParams } from "next/navigation";
import QuantityCounter from "../QuantityCounter";
import { useMemo, useState } from "react";
import CartButton from "../AddCartButton";
import PieceBoxRadio from "../PieceBoxRadio";

const ProductDetailModal = ({
  onClose,
  open,
  product,
}: {
  onClose: () => void;
  open: boolean;
  product: Product;
}) => {
  const t = useTranslation();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const isRtl = locale === "ar";
  const [quantity, setQuantity] = useState<number>(1);
  const [method, setMethod] = useState<"0" | "1">("0");

  const finalPrice = useMemo(() => {
    return formatCurrency(
      method === "0"
        ? product.final_price
        : Number(product.pieces_per_box) * product.final_price
    );
  }, [product.final_price, product.pieces_per_box, method]);

  const oldPriceTotal = useMemo(() => {
    if (method === "0") return product.old_price;
    return Number(product.pieces_per_box) * Number(product.old_price);
  }, [product.old_price, product.pieces_per_box, method]);

  const maxVal = useMemo(() => {
    if (method === "0") return product.quantity;
    return mergePiecesToBoxes(
      Number(product.quantity),
      Number(product.pieces_per_box)
    );
  }, [product, quantity, method]);

  const ProductCardImage = () => {
    const { imgRef } = useProductImage();

    return (
      <div className="relative">
        <Image
          src={product.images[0].image}
          alt="banner"
          width={800}
          height={250}
          className="object-contain rounded-lg dark:bg-white w-full"
          style={{ height: 230, width: 300 }}
          loading="lazy"
          ref={imgRef}
        />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-auto sm:max-w-2xl lg:max-w-3xl bg-card sm:mx-auto px-4 py-6">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mt-4">
          <ProductImageProvider initialImage={product.images[0].image}>
            <div className="w-full sm:w-auto flex justify-center">
              <ProductCardImage />
            </div>

            <div className="w-full">
              <h6 className="font-semibold text-lg sm:text-xl my-2 sm:my-3">
                {isRtl ? product.ar_name : product.name}
              </h6>

              {product.discount_percent > 0 ? (
                <>
                  <span className="text-base sm:text-lg font-semibold">
                    {finalPrice}&nbsp;{t("sar")}
                  </span>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0 mt-1">
                    <del className="text-sm sm:text-base">
                      {formatCurrency(Number(oldPriceTotal))} {t("sar")}
                    </del>
                    <span
                      dir={isRtl ? "rtl" : "ltr"}
                      className={`text-sm sm:text-base ${
                        isRtl ? "text-right" : "text-left"
                      }`}
                    >
                      <span className="text-red-500 font-semibold">
                        {t("discount")}
                      </span>{" "}
                      {product.discount_percent}%
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-base sm:text-lg font-semibold">
                  {finalPrice} {t("sar")}
                </span>
              )}

              <div className="my-2 text-sm sm:text-md">
                {t("available_stock")}: <b>{maxVal}</b>
              </div>

              {product.is_uom_small === "1" &&
                product?.product_unit &&
                product?.uom_product_unit && (
                  <div className="my-4 pt-2">
                    <PieceBoxRadio
                      onChange={setMethod}
                      isRtl={isRtl}
                      value={method}
                      perBox={product.pieces_per_box}
                      productUnit={product.product_unit}
                      uomUnit={product.uom_product_unit}
                    />
                  </div>
                )}

              <div className="flex flex-col sm:flex-row gap-3  sm:items-center sm:justify-around">
                <QuantityCounter
                  quantity={quantity}
                  setQuantity={setQuantity}
                  maxVal={Number(maxVal)}
                />
                <CartButton
                  product={{
                    image: product.images[0].image,
                    id: product.id,
                    quantity: quantity.toString(),
                    available: quantity <= Number(maxVal),
                    isBox: method === "1",
                  }}
                  title={
                    Number(product.quantity) <= 0
                      ? t("out_of_stock")
                      : t("add_to_cart")
                  }
                  className="bg-coffee-brown hover:bg-amber-400 rounded-lg w-full sm:w-[180px] p-4 sm:p-5 shadow-md"
                />
              </div>
            </div>
          </ProductImageProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
