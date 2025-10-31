"use client";

import { useTranslation } from "@/providers/TranslationProvider";
import Link from "next/link";
import { useParams } from "next/navigation";
import WishlistButton from "./common/AddToWishlistButton";
import {
  ProductImageProvider,
  useProductImage,
} from "@/providers/ProductImageProvider";
import { Product } from "@/types/product";
import { formatCurrency } from "@/helpers/dataFormat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const ProductCard = ({
  product,
  onButtonClick,
}: {
  product: Product;
  onButtonClick: () => void;
}) => {
  const t = useTranslation();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const isRtl = locale === "ar";

  const isAvailable = useMemo(
    () => Number(product.quantity) > 0,
    [product.quantity]
  );

  const ProductCardImage = () => {
    const { imgRef } = useProductImage();
    return (
      <div className="relative">
        <img
          src={product.images[0].image}
          alt="product"
          width={800}
          height={170}
          className="object-contain bg-white min-w-[250px]"
          style={{ height: 180, width: "100%" }}
          loading="lazy"
          ref={imgRef}
        />
      </div>
    );
  };

  // console.log(product);

  return (
    <ProductImageProvider initialImage={product.images[0].image}>
      <Card className="w-full max-w-[300px] mx-auto relative overflow-hidden flex self-start flex-col">
        <CardContent className="text-start p-0">
          <Link href={`/${locale}/products/${product.id}`}>
            <ProductCardImage />
            <div className="px-2">
              <h6 className="font-semibold text-base line-clamp-1 mt-3">
                {isRtl ? product.ar_name : product.name}
              </h6>

              {product.discount_percent > 0 ? (
                <>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-lg font-semibold text-primary">
                      {formatCurrency(product.final_price)} {t("sar")}
                    </span>
                    {product.discount_amount > 0 ? (
                      <div className="flex justify-between items-center p-1 bg-green-100 rounded-md w-fit">
                        <span className="text-sm text-gray-500">
                          {t("save_discount")}: {product.discount_amount}{" "}
                          {t("sar")}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="flex justify-start items-center gap-3 text-sm mt-1">
                    <del className="text-gray-500">
                      {formatCurrency(Number(product.old_price))} {t("sar")}
                    </del>
                    <span
                      dir={isRtl ? "rtl" : "ltr"}
                      className="text-red-500 font-semibold"
                    >
                      {t("discount")} {product.discount_percent}%
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-lg font-semibold text-primary">
                  {formatCurrency(product.final_price)} {t("sar")}
                </span>
              )}
              <div className="h-8 space-y-2">
                <p className="text-sm text-gray-500 dark:text-white line-clamp-2">
                  {isRtl ? product.ar_description : product.description}
                </p>
              </div>
              {product.taxes.length > 0 && (
                <div className="mt-3">
                  <div>{t("included")}</div>
                  <div className="flex flex-wrap gap-2">
                    {product.taxes.map((tax) => (
                      <Badge
                        className="bg-green-100 mt-2 text-gray-500 whitespace-normal"
                        key={tax.name}
                      >
                        {tax.name}&nbsp;{tax.rate}%
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Link>
        </CardContent>

        <CardFooter className="flex flex-col justify-center items-center px-2 gap-3">
          <Separator />
          <div className="w-[160px] flex flex-row justify-between items-center mt-2">
            <WishlistButton
              product={{
                id: product.id,
                image: product.images[0]?.image,
                isLiked: product.is_liked,
              }}
              tooltip={t("add_to_wishlist")}
              className={cn("p-3 cursor-pointer hover:shadow-xl")}
            />
            <Button
              className={cn(
                "text-coffee-brown dark:text-white w-fit rounded-full p-5 z-1 cursor-pointer",
                {
                  "bg-card dark:bg-white dark:text-black shadow-md hover:bg-amber-400 hover:text-white dark:hover:bg-amber-400 dark:hover:text-white":
                    isAvailable,
                  "opacity-50 cursor-not-allowed bg-red-500 text-white":
                    !isAvailable,
                }
              )}
              onClick={isAvailable ? onButtonClick : undefined}
            >
              <DynamicIcon name="shopping-cart" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </ProductImageProvider>
  );
};

export default ProductCard;
