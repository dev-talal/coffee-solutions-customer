"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";
import { useTranslation } from "@/providers/TranslationProvider";
import { Product } from "@/types/product";
import { PaginatedResponse } from "@/types/pagination";
import { getOtherProducts } from "@/services/apiService";

import PriceFilterPopover from "@/app/components/common/filters/PricePopoverFilter";
import SortSelect from "@/app/components/common/filters/SortSelectFilter";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import CustomPagination from "@/app/components/common/CustomPagination";
import ProductDetailModal from "@/app/components/common/modal/ProductDetailModal";
import SkeletonLoader from "@/app/components/common/SkeletonLoader";

const allowedSlugs = [
  "promotional-products",
  "popular-products",
  "recent-products",
  "searched-results",
];

const sortSlugs = [
  "recent-products",
  "low-to-high",
  "high-to-low",
  "popular-products",
];

const ProductsPage = () => {
  const t = useTranslation();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = params.locale || "en";
  const isRtl = locale === "ar";
  const slug = params?.slug || "";
  const search = searchParams.get("search") ?? "";

  const [products, setProducts] = useState<PaginatedResponse<Product>>({
    data: [],
    meta: { current_page: 1, per_page: 10, total: 0, last_page: 0 },
  });

  const [filters, setFilters] = useState({
    min: "" as number | "",
    max: "" as number | "",
    sort: sortSlugs.includes(slug as string)
      ? (slug as string)
      : "recent-products",
    page: 1,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!allowedSlugs.includes(slug as string)) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getOtherProducts({
          search,
          min: filters.min,
          max: filters.max,
          sort: filters.sort,
          page: filters.page,
        });
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters, search, slug]);

  useEffect(() => {
    if (!allowedSlugs.includes(slug as string))
      router.replace(`/${locale}/404`);
  }, [slug, locale, router]);

  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("productAdded", handler);
    return () => window.removeEventListener("productAdded", handler);
  }, []);

  const handleApplyPriceFilters = (min: number | "", max: number | "") => {
    setFilters((prev) => ({ ...prev, min, max, page: 1 }));
  };

  const handleClearPriceFilters = () => {
    setFilters((prev) => ({ ...prev, min: "", max: "", page: 1 }));
  };

  const handleSortChange = (sort: string) => {
    setFilters((prev) => ({ ...prev, sort, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (!allowedSlugs.includes(slug as string)) return null;

  return (
    <>
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">{t(slug as string)}</h2>

        <div className="flex flex-wrap gap-4 mb-6 items-end relative z-2">
          <PriceFilterPopover
            minPrice={filters.min}
            maxPrice={filters.max}
            onApply={handleApplyPriceFilters}
            onClear={handleClearPriceFilters}
            isRtl={isRtl}
            t={t}
          />

          <SortSelect
            sortOption={filters.sort}
            setSortOption={handleSortChange}
            isRtl={isRtl}
            t={t}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {isLoading ? (
            <SkeletonLoader count={10} type="product-card" />
          ) : products.data.length > 0 ? (
            products.data.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onButtonClick={() => {
                  setSelectedProduct(product);
                  setOpen(true);
                }}
              />
            ))
          ) : (
            <p className="text-center text-lg font-semibold text-red-500">
              {t("productsNotFound")}
            </p>
          )}
        </div>

        {products.meta.last_page > 1 && (
          <div className="mt-4">
            <CustomPagination
              currentPage={products.meta.current_page}
              totalPages={products.meta.last_page}
              onPageChange={handlePageChange}
            />
          </div>
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
};

export default ProductsPage;
