"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductCategory } from "@/types/product";
import { useTranslation } from "@/providers/TranslationProvider";
import assets from "@/assets";
import { DynamicIcon } from "lucide-react/dynamic";
import Image from "next/image";
import Link from "next/link";
import FooterBottomBar from "./FooterBottomBar";
import { useParams } from "next/navigation";
import { getProductCategories } from "@/services/apiService";

const Footer = () => {
  const t = useTranslation();
  const params = useParams();
  const locale = params.locale || "en";
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const getCategories = useCallback(async () => {
    try {
      const res = await getProductCategories();
      setCategories(res);
    } catch (_) {}
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const parentCategories = useMemo(() => {
    return [
      ...new Map(
        categories
          .filter((x) => x.parent?.id)
          .map((category) => [category.parent.id, category.parent])
      ).values(),
    ];
  }, [categories]);

  return (
    <>
      <footer className="bg-coffee-brown text-white py-10 rounded-t-4xl mt-5">
        <div className="container px-4 mx-auto">
          <ul className="grid grid-cols-1 px-2 sm:grid-cols-2 lg:grid-cols-12 gap-6 list-none">
            <li className="lg:col-span-5 sm:col-span-2 space-y-4">
              <Image
                src={assets.img.logoNew}
                className="invert brightness-0"
                width={150}
                height={150}
                alt="Coffee Solutions"
              />
              <div>
                <h3 className="text-xl font-semibold">{t("about_us")}</h3>
                <p className="pt-3 pe-5 text-gray-200">
                  {t("about_us_detail")}
                </p>
              </div>
            </li>

            <li className="lg:col-span-2 sm:col-span-1">
              <h3 className="text-xl font-semibold mb-3">{t("categories")}</h3>
              <ul className="space-y-2 text-gray-200">
                <li>
                  <Link href="#">{t("machines_maintenance")}</Link>
                </li>
                {categories.length > 0 &&
                  parentCategories.map((parent) => (
                    <li key={parent.id}>
                      <Link href={`/${locale}/categories/${parent.id}`}>
                        {locale === "ar" ? parent.ar_name : parent.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>

            {/* Important Links */}
            <li className="lg:col-span-2 sm:col-span-1">
              <h3 className="text-xl font-semibold mb-3">
                {t("important_links")}
              </h3>
              <ul className="space-y-2 text-gray-200">
                <li>
                  <Link href={`/${locale}/about-us`}>{t("about_us")}</Link>
                </li>
                <li>
                  <Link href={`/${locale}/contact-us`}>{t("contact_us")}</Link>
                </li>
                {/* <li>
                  <Link href={`/${locale}/frequently-asked-questions`}>
                    {t("faq")}
                  </Link>
                </li> */}
                <li>
                  <Link href={`/${locale}/privacy-policy`}>
                    {t("privacy_policy")}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/terms-conditions`}>
                    {t("terms_conditions")}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/exchange-&-return-policy`}>
                    {t("exchange_return_policy")}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/after-sales-services`}>
                    {t("after_sales_services")}
                  </Link>
                </li>
              </ul>
            </li>

            {/* Contact & Social Links */}
            <li className="lg:col-span-3 sm:col-span-2 space-y-3">
              <h3 className="text-xl font-semibold">{t("contact_us")}</h3>
              <ul>
                <li className="flex">
                  <DynamicIcon
                    size={20}
                    name="map-pin"
                    className="flex-shrink-0 me-2"
                  />
                  Arabia, Riyadh, الربوة, طريق مكة المكرمة الفرعي
                </li>
              </ul>
              <div>
                <h3 className="text-xl font-semibold mb-3 pt-3">
                  {t("social_links")}
                </h3>
                <ul>
                  <li className="flex space-x-3">
                    <Link
                      href="https://www.facebook.com/CoffeeSolutionsKSA"
                      target="_blank"
                    >
                      <DynamicIcon
                        size={22}
                        name="facebook"
                        className="flex-shrink-0 me-2"
                      />
                    </Link>
                    <Link
                      href="https://www.instagram.com/coffeesolutionsksa"
                      target="_blank"
                    >
                      <DynamicIcon
                        size={22}
                        name="instagram"
                        className="flex-shrink-0 me-2"
                      />
                    </Link>
                    <Link
                      href="https://www.snapchat.com/add/coffeesoluksa"
                      target="_blank"
                    >
                      <Image
                        src={assets.icons.snapchatIcon}
                        width={22}
                        height={22}
                        alt="snapchat"
                        className="invert brightness-0"
                      />
                    </Link>
                    <Link
                      href="https://www.tiktok.com/@coffeesolutionsksa"
                      target="_blank"
                    >
                      <Image
                        src={assets.icons.tiktokIcon}
                        width={22}
                        height={22}
                        alt="tiktok"
                        className="invert brightness-0"
                      />
                    </Link>
                    <Link href="tel:+966531110324">
                      <DynamicIcon
                        size={22}
                        name="phone"
                        className="flex-shrink-0 me-2"
                      />
                    </Link>
                    <Link href="mailto:website@suncafe.com.sa">
                      <DynamicIcon
                        size={22}
                        name="mail"
                        className="flex-shrink-0 me-2"
                      />
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </footer>
      <FooterBottomBar />
    </>
  );
};

export default Footer;
