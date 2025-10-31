"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "@/providers/TranslationProvider";
import { ProductImageProvider } from "@/providers/ProductImageProvider";
import { Product } from "@/types/product";
import { useParams } from "next/navigation";
import MagnifyImage from "./MagnifyImage";
import Image from "next/image";
import CartButton from "./common/AddCartButton";
import assets from "@/assets";
import Link from "next/link";
import { DynamicIcon } from "lucide-react/dynamic";
import ProductThumbnailSlider from "./sliders/ProductThumbnailSlider";
import WishlistButton from "./common/AddToWishlistButton";
import QuantityCounter from "./common/QuantityCounter";
import PieceBoxRadio from "./common/PieceBoxRadio";
import { formatCurrency, mergePiecesToBoxes } from "@/helpers/dataFormat";
import ProductDescription from "./ProductDescription";

const ProductDetailContent = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [method, setMethod] = useState<"0" | "1">("0");

  const t = useTranslation();
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.id}`;
  const params = useParams();
  const locale = params?.locale || "en";
  const isRtl = locale === "ar";

  const finalPrice = useMemo(() => {
    return formatCurrency(
      method === "0"
        ? product.final_price
        : Number(product.pieces_per_box) * product.final_price
    );
  }, [product.final_price, method]);

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

  return (
    <ProductImageProvider initialImage={product.images[0].image}>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <MagnifyImage alt={product.name} />
          {product.images.length > 1 && (
            <ProductThumbnailSlider images={product.images} />
          )}
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black max-w-[380px]">
              {isRtl ? product.ar_name : product.name}
            </h1>
            <WishlistButton
              product={{
                image: product.images[0].image,
                id: product.id,
                isLiked: Boolean(product.is_liked),
              }}
              liked={Boolean(product.is_liked)}
              tooltip={t("add_to_wishlist")}
              className="ml-4"
            />
          </div>

          <div>
            <div className="flex items-center space-x-4">
              <p className="text-3xl font-semibold text-red-600">
                {finalPrice}&nbsp;{t("sar")}
              </p>
              {product.discount_percent > 0 && (
                <>
                  <p className="text-lg line-through text-foreground">
                    {formatCurrency(Number(oldPriceTotal))} ﷼
                  </p>
                  <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                    {product.discount_percent}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          <ProductDescription product={product} isRtl={isRtl} />

          <p className="text-sm">
            {t("available_stock")}:&nbsp;
            <span className="font-semibold">{maxVal}</span>
          </p>

          {product.is_uom_small === "1" &&
            product?.product_unit &&
            product?.pieces_per_box && (
              <div className="my-4">
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

          {Number(product.quantity) > 0 && (
            <div>
              <QuantityCounter
                quantity={quantity}
                maxVal={Number(maxVal)}
                setQuantity={setQuantity}
              />
            </div>
          )}

          {product.prmotion_products && (
            <div>
              <span className="text-base text-foreground font-semibold">
                {t("promotional_products")}
              </span>
              <div className="grid grid-cols-3 space-x-4 space-y-3 my-3">
                {product.prmotion_products.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 shadow-sm p-1 rounded-sm"
                  >
                    <Image
                      src={item.product.images[0].image}
                      alt={item.product.name}
                      width={30}
                      height={30}
                      className="rounded-lg"
                    />
                    <span className="text-[14px] text-foreground font-medium">
                      {item.quantity} x {item.product.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            className="bg-coffee-brown hover:bg-amber-400 rounded-lg w-[180px] p-5 shadow-md"
          />

          <div className="space-x-4 mt-4">
            <span className="text-base text-foreground font-semibold">
              {t("share_product")}
            </span>
            <div className="flex items-center space-x-4 mt-3">
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  pageUrl
                )}`}
                target="_blank"
              >
                <DynamicIcon name="facebook" className="w-5 h-5" />
              </Link>
              <Link
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                  pageUrl
                )}&media=${encodeURIComponent(
                  product.images[0].image
                )}&description=${encodeURIComponent(
                  product.name + " - ﷼" + product.final_price
                )}`}
                target="_blank"
              >
                <Image
                  width={20}
                  height={20}
                  src={assets.icons.pinterestIcon}
                  alt="Pintrest"
                  className="dark:invert"
                />
              </Link>
              <Link
                href={`https://x.com/intent/tweet?url=${encodeURIComponent(
                  pageUrl
                )}&text=${encodeURIComponent(
                  product.name + " - ﷼" + product.final_price
                )}`}
                target="_blank"
              >
                <Image
                  width={20}
                  height={20}
                  src={assets.icons.xIcon}
                  alt="twitter"
                  className="dark:invert"
                />
              </Link>
              <Link
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${product.name} - ﷼${product.final_price}\n${pageUrl}`
                )}`}
                target="_blank"
              >
                <Image
                  width={20}
                  height={20}
                  src={assets.icons.whatsappIcon}
                  alt="whatsapp"
                  className="dark:invert"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProductImageProvider>
  );
};

export default ProductDetailContent;
