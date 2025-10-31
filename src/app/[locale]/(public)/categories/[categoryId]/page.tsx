"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductCategory, Product } from "@/types/product";
import {
  getProductCategories,
  getProductsByCategory,
} from "@/services/apiService";
import ProductCard from "@/app/components/ProductCard";
import CategoriesSlider from "@/app/components/sliders/CategoriesSlider";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Cookies from "js-cookie";
import { useTranslation } from "@/providers/TranslationProvider";
import ProductDetailModal from "@/app/components/common/modal/ProductDetailModal";
import { PaginatedResponse } from "@/types/pagination";
import CustomPagination from "@/app/components/common/CustomPagination";

export default function CategoryDetailsPage() {
  const { categoryId } = useParams();
  const t = useTranslation();
  const params = useParams();
  const locale = params.locale || "en";
  const isRtl = locale === "ar";

  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [allCategories, setAllCategories] = useState<ProductCategory[]>([]);
  const [allProducts, setAllProducts] = useState<PaginatedResponse<Product>>({
    data: [],
    meta: {
      current_page: 1,
      per_page: 10,
      total: 0,
      last_page: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const token = Cookies.get(
    process.env.NEXT_PUBLIC_COOKIE_TOKEN_NAME as string
  );

  const fetchCategoryDetails = async (page = 1) => {
    try {
      const categories = await getProductCategories(token);
      const selectedCategory = categories.find(
        (cat) => cat.id === Number(categoryId)
      );

      setAllCategories(categories);
      setCategory(selectedCategory || null);

      if (selectedCategory) {
        const productsData = await getProductsByCategory(
          selectedCategory.id,
          token,
          page
        );
        setAllProducts(productsData);
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategoryDetails();
    }
  }, [categoryId]);

  const subcategories = allCategories.filter(
    (cat) => cat.parent?.id === Number(categoryId)
  );

  useEffect(() => {
    const handler = () => {
      setOpen(false);
    };

    window.addEventListener("productAdded", handler);

    return () => {
      window.removeEventListener("productAdded", handler);
    };
  }, []);

  const onPageChange = async (page: number) => {
    const productsData = await getProductsByCategory(
      Number(categoryId),
      token,
      page
    );
    setAllProducts(productsData);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center mb-10">
          <Skeleton className="w-20 h-20 rounded-lg" />
          <Skeleton className="h-8 w-64 ml-4" />
        </div>
        <div className="mt-10">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return <div>{t("categoryNotFound")}</div>;
  }

  return (
    <>
      <div className="container mx-auto px-6 py-10">
        <div className="flex items-center mb-10">
          {category.icon && (
            <Image
              src={category.icon}
              alt={isRtl ? category.ar_name : category.name}
              width={80}
              height={80}
              className="rounded-lg object-contain"
            />
          )}
          <h1 className="text-3xl font-bold ml-4">
            {isRtl ? category.ar_name : category.name}
          </h1>
        </div>

        {subcategories.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">{t("subcategories")}</h2>
            <CategoriesSlider categories={subcategories} />
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">{t("all_products")}</h2>
          {allProducts.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {allProducts.data.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onButtonClick={() => {
                    setSelectedProduct(product);
                    setOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-lg font-semibold text-coffee-brown">
              {t("productsNotFound")}
            </p>
          )}
          {allProducts.meta?.last_page > 1 && !loading && (
            <div className="mt-7 pt-7">
              <CustomPagination
                currentPage={allProducts.meta.current_page}
                totalPages={allProducts.meta.last_page}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
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
