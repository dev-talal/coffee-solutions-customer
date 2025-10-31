import { getTranslations } from "@/i18n/server";
import type { Metadata } from "next";
import HomeBannerSlider from "../../components/sliders/HomeBannerSlider";
import ProductSlider from "../../components/sliders/ProductSlider";
import MiddleBannerSlider from "../../components/sliders/MiddleBannerSlider";
import CategoriesSlider from "../../components/sliders/CategoriesSlider";
import { notFound } from "next/navigation";
import { ApiResponseCollection, Banner as BannerType } from "@/types/product";
import { getHomeBannersQuery, getHomeDataQuery } from "@/services/apiService";
import { cookies } from "next/headers";
import Banner from "@/app/components/Banner";
import assets from "@/assets";

export const metadata: Metadata = {
  title: "Coffee Solutions | Premium Coffee Beans & Brewing Gear",
  description:
    "Discover premium coffee beans, brewing equipment, and accessories at Coffee Solutions. Freshly roasted and delivered to your door.",
  keywords: ["coffee", "coffee beans", "brewing gear", "premium coffee"],
  openGraph: {
    title: "Coffee Solutions",
    description: "Premium coffee beans & brewing equipment for coffee lovers.",
    url: "https://coffeesolutions.com",
    siteName: "Coffee Solutions",
    images: [
      {
        url: "https://media.zid.store/3bcef6c0-0969-4fb7-833d-4b2274026a23/afb94b30-3f04-456e-86d6-15b6f873c0db-32x32.png",
        width: 1200,
        height: 630,
        alt: "Coffee Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

async function getHomeData(): Promise<ApiResponseCollection> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(
      process.env.NEXT_PUBLIC_COOKIE_TOKEN_NAME as string
    )?.value;

    return await getHomeDataQuery(token);
  } catch (e) {
    console.error(e);
    notFound();
  }
}

async function getHomeBanners(): Promise<BannerType[]> {
  try {
    return await getHomeBannersQuery();
  } catch (e) {
    console.error(e);
    notFound();
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const products = await getHomeData();
  const banners = await getHomeBanners();

  const { locale } = await params;
  const t = await getTranslations(locale, "common");

  return (
    <main className="container mx-auto p-4 space-y-8 mt-6 bg-card rounded-xl">
      <div>
        <HomeBannerSlider banners={banners} />
      </div>

      <div className="space-y-8 py-5">
        <h3 className="text-3xl font-black text-coffee-brown dark:text-white">
          {t.promotional_products}
        </h3>
        <ProductSlider
          products={products.promotions}
          viewAllLink={`/${locale}/promotional-products`}
        />
      </div>

      <div className="py-5">
        <MiddleBannerSlider banners={banners} locale={locale} />
      </div>

      <div className="space-y-8 mb-5">
        <h3 className="text-3xl font-black text-coffee-brown dark:text-white">
          {t.categories}
        </h3>
        <CategoriesSlider
          categories={products.product_categories}
          viewAllLink={`/${locale}/categories`}
        />
      </div>

      <div className="space-y-8 py-5">
        <h3 className="text-3xl font-black text-coffee-brown dark:text-white">
          {t.recent_products}
        </h3>
        <ProductSlider
          products={products.recent_products}
          viewAllLink={`/${locale}/recent-products`}
        />
      </div>
      <div className="space-y-8 py-5">
        <Banner image={assets.img.machineBanner} />
      </div>
      <div className="space-y-8 py-5">
        <h3 className="text-3xl font-black text-coffee-brown dark:text-white">
          {t.popular_products}
        </h3>
        <ProductSlider
          products={products.popular_products}
          viewAllLink={`/${locale}/popular-products`}
        />
      </div>
    </main>
  );
}
