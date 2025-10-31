"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import ProductSlider from "./sliders/ProductSlider";
import { getSuggestedProducts } from "@/services/apiService";
import { Product } from "@/types/product";
import { DynamicIcon } from "lucide-react/dynamic";
import { useTranslation } from "@/providers/TranslationProvider";

function SuggestedProductsComponent({ productId }: { productId: number }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const t = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getSuggestedProducts(productId);
        setProducts(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [productId]);

  if (!products) {
    return <DynamicIcon name="loader" className="w-7 h-7 animate-spin" />;
  }

  return (
    products.length > 0 && (
      <>
        <h3 className="text-3xl font-black text-coffee-brown dark:text-white">
          {t("you_may_also_like")}
        </h3>
        <ProductSlider products={products} />
      </>
    )
  );
}

const SuggestedProducts = dynamic(
  () => Promise.resolve(SuggestedProductsComponent),
  {
    ssr: false,
    loading: () => (
      <DynamicIcon name="loader" className="w-7 h-7 animate-spin" />
    ),
  }
);

export default SuggestedProducts;
