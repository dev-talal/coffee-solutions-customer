"use client";
import { useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";

import { DynamicIcon } from "lucide-react/dynamic";
import { ProductCategory } from "@/types/product";
import ViewAllButton from "../ViewAllButton";

const CategoriesSlider = ({
  categories,
  viewAllLink,
}: {
  categories: ProductCategory[];
  viewAllLink?: string;
}) => {
  const router = useRouter();

  const params = useParams();
  const locale = params.locale || "en";

  const isRtl = locale === "ar";

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: { perView: 5, spacing: 10 },
    rtl: isRtl,
    breakpoints: {
      "(max-width: 1200px)": { slides: { perView: 4, spacing: 10 } },
      "(max-width: 992px)": { slides: { perView: 3, spacing: 10 } },
      "(max-width: 768px)": { slides: { perView: 2, spacing: 10 } },
      "(max-width: 575px)": { slides: { perView: 1, spacing: 10 } },
    },
  });
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => slider.current?.next(), 3000);
  }, [slider, stopAutoplay]);

  useEffect(() => {
    if (slider) {
      startAutoplay();
    }
    return () => stopAutoplay();
  }, [slider, startAutoplay, stopAutoplay]);

  return (
    <div className="flex flex-col space-y-20">
      <div className="relative">
        <div
          ref={sliderRef}
          className="keen-slider products-slick-container"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          {categories.map((category, i) => (
            <div
              key={i}
              className="keen-slider__slide text-center flex flex-col items-center cursor-pointer"
              onClick={() =>
                router.push(`/${locale}/categories/${category.id}`)
              }
            >
              <div className="w-40 mx-auto">
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={200}
                  height={100}
                  style={{ width: 180, height: 180 }}
                  className="rounded-lg w-full object-contain"
                  loading="lazy"
                />
                <h3 className="text-lg font-semibold mt-2">
                  {isRtl ? category.ar_name : category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            stopAutoplay();
            isRtl ? slider.current?.next() : slider.current?.prev();
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-coffee-brown dark:bg-white dark:text-black text-white shadow p-2 rounded-full"
        >
          <DynamicIcon name="chevron-left" className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            stopAutoplay();
            isRtl ? slider.current?.prev() : slider.current?.next();
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-coffee-brown dark:bg-white dark:text-black text-white shadow p-2 rounded-full"
        >
          <DynamicIcon name="chevron-right" className="w-5 h-5" />
        </button>
      </div>
      {viewAllLink && <ViewAllButton link={viewAllLink} />}
    </div>
  );
};

export default CategoriesSlider;
