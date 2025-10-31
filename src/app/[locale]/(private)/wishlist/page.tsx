"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/app/components/ProductCard";
import { useTranslation } from "@/providers/TranslationProvider";
import { useWishlist } from "@/providers/AddWishlistContext";
import { Product } from "@/types/product";
import ProductDetailModal from "@/app/components/common/modal/ProductDetailModal";
import SkeletonLoader from "@/app/components/common/SkeletonLoader";

export default function WishlistPage() {
  const { wishlists, getWishlists, apiLoading } = useWishlist();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const t = useTranslation();
  const likedItems = useMemo(
    () => wishlists.filter((item) => item.product.is_liked),
    [wishlists]
  );

  useEffect(() => {
    getWishlists();
  }, [getWishlists]);

  useEffect(() => {
    const handler = () => {
      setOpen(false);
    };

    window.addEventListener("productAdded", handler);

    return () => {
      window.removeEventListener("productAdded", handler);
    };
  }, []);

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            {t("wishlist")}
          </h2>
        </div>
        {apiLoading ? (
          <div className="justify-center flex flex-col items-center">
            <div className="mt-4">
              <SkeletonLoader />
            </div>
          </div>
        ) : likedItems.length > 0 ? (
          <div className="border-0 shadow-none pt-0">
            <div className="justify-center flex flex-col items-center">
              <div
                className="
                        grid gap-5
                        grid-cols-1 sm:grid-cols-2
                        lg:grid-cols-3 xl:grid-cols-5
                        mt-4
                      "
              >
                {likedItems.map((item) => (
                  <div
                    key={item.product.id + item.product.name}
                    className="w-full"
                  >
                    <ProductCard
                      product={item.product}
                      onButtonClick={() => {
                        setOpen(true);
                        setSelectedProduct(item.product);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">{t("emptyWishlist")}</p>
        )}
      </div>
      {selectedProduct && open && (
        <ProductDetailModal
          open={open}
          onClose={() => setOpen(false)}
          product={selectedProduct}
        />
      )}
    </>
  );
}
