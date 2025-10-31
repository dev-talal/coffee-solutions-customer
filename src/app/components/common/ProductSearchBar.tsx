"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "lucide-react/dynamic";
import Image from "next/image";
import { useTranslation } from "@/providers/TranslationProvider";
import { getSearchProducts } from "@/services/apiService";
import { Product } from "@/types/product";
import { useRouter } from "nextjs-toploader/app";
import { formatCurrency } from "@/helpers/dataFormat";

const ProductSearchBar = ({ locale }: { locale: string }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslation();

  const handleSearch = async () => {
    setLoading(true);
    setShowResults(true);
    try {
      const data = await getSearchProducts(query);
      setResults(data);
    } catch (_) {
      setResults([]);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      handleSearch();
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/${locale}/searched-results?search=${query}`);
      setShowResults(false);
    }
  };

  const handleSelect = (product: Product) => {
    setShowResults(false);
    setQuery("");
    router.push(`/${locale}/products/${product.id}`);
  };

  useEffect(() => {
    if (!query.trim()) {
      setShowResults(false);
      return;
    } else {
      debouncedSearch();
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder={t("search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-full pl-10 w-full lg:w-60 xl:w-100"
        />
        <DynamicIcon
          name="search"
          className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      {showResults && (
        <Card
          className="absolute mt-2 w-full rounded-xl shadow-lg z-100  overflow-y-auto"
          ref={containerRef}
        >
          <CardContent className="p-2 space-y-2 max-h-[70vh]">
            {loading ? (
              <DynamicIcon
                name="loader"
                className="w-8 h-8 mx-auto text-coffee-brown animate-spin"
              />
            ) : results.length > 0 ? (
              results.map((product) => (
                <div
                  key={product.id}
                  className={cn(
                    "flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => handleSelect(product)}
                >
                  <Image
                    src={product.images[0].image}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-contain bg-white p-1"
                    style={{ height: "50px" }}
                  />
                  <div>
                    <span className="text-sm font-medium line-clamp-2">
                      {product.name}
                    </span>
                    {t("sar")}&nbsp;<b>{formatCurrency(product.final_price)}</b>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500">
                No products found.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductSearchBar;
