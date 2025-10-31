"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/providers/TranslationProvider";
import { ProductCategory } from "@/types/product";
import { getProductCategories } from "@/services/apiService";
import Image from "next/image";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslation();
  const params = useParams();
  const locale = params.locale || "en";
  const isRtl = locale === "ar";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get(
          process.env.NEXT_PUBLIC_COOKIE_TOKEN_NAME as string
        );
        const data = await getProductCategories(token);
        setCategories(data);
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const parentCategories = categories.filter(
    (cat) => !cat.parent || cat.parent === null
  );

  const getChildren = (parentId: number) =>
    categories.filter((cat) => cat.parent && cat.parent.id === parentId);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="py-2 px-4 mb-10">
          <div className="h-8 w-40 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 justify-items-center">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center max-w-xs"
            >
              <div className="mb-4">
                <div className="w-[120px] h-[120px] rounded-full bg-gray-300 animate-pulse" />
              </div>
              <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-2" />
              <ul className="space-y-1">
                <li className="h-4 w-24 bg-gray-300 rounded animate-pulse mx-auto" />
                <li className="h-4 w-20 bg-gray-300 rounded animate-pulse mx-auto" />
                <li className="h-4 w-28 bg-gray-300 rounded animate-pulse mx-auto" />
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && parentCategories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 flex justify-center items-center h-64">
        <p className="text-lg font-semibold text-coffee-brown">
          {t("no_results")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="py-2 px-4 mb-10">
        <h1 className="text-2xl font-bold">{t("all_categories")}</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 justify-items-center">
        {parentCategories.map((parent) => (
          <div
            key={parent.id}
            className="flex flex-col items-center text-center max-w-xs"
          >
            <Link href={`/${locale}/categories/${parent.id}`}>
              <div className="mb-4 flex flex-col items-center hover:underline">
                <Image
                  src={parent.icon}
                  alt={parent.name}
                  width={120}
                  height={120}
                  loading="lazy"
                  className="object-cover rounded-full"
                  style={{ width: 120, height: 120 }}
                />
                <h3 className="text-xl font-semibold text-coffee-brown my-2">
                  {isRtl ? parent.ar_name : parent.name}
                </h3>
              </div>
            </Link>
            <ul className="text-sm text-coffee-brown space-y-1">
              {getChildren(parent.id).map((child) => (
                <li key={child.id}>
                  <a
                    href={`/${locale}/categories/${child.id}`}
                    className="hover:underline"
                  >
                    {isRtl ? child.ar_name : child.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
