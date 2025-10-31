"use client";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import assets from "@/assets";
import { useSidebar } from "@/components/ui/sidebar";
import { Banner } from "@/types/product";
import { useRouter } from "nextjs-toploader/app";

const MiddleBannerSlider = ({
  banners = [],
  locale,
}: {
  banners: Banner[];
  locale: string;
}) => {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: { perView: 1 },
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

  const categoryBanners = useMemo(() => {
    return banners.filter((banner) => banner.type === "category");
  }, [banners]);

  useEffect(() => {
    if (slider && categoryBanners.length > 1) {
      startAutoplay();
    }
    return () => stopAutoplay();
  }, [slider, startAutoplay, stopAutoplay, categoryBanners.length]);

  const handleMouseEnter = () => stopAutoplay();
  const handleMouseLeave = () => {
    if (categoryBanners.length > 1) startAutoplay();
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={sliderRef} className="keen-slider rounded-lg overflow-hidden">
        {categoryBanners.length > 0 ? (
          categoryBanners.map((b, i) => (
            <div key={"banner" + i} className="keen-slider__slide relative">
              <div
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/${locale}/categories/${b.category.id}`)
                }
                title={b.category.name}
              >
                <img
                  src={b.url}
                  alt="banner"
                  style={{ width: "100%", height: isMobile ? 300 : 500 }}
                />
              </div>
            </div>
          ))
        ) : (
          <Image
            src={assets.img.homeBanner1}
            alt="default banner"
            width={1500}
            style={{ width: "100%", height: isMobile ? 300 : 500 }}
            priority
          />
        )}
      </div>
    </div>
  );
};

export default MiddleBannerSlider;
