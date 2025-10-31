"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import assets from "@/assets";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { Banner } from "@/types/product";

const HomeBannerSliderInner = ({ banners = [] }: { banners: Banner[] }) => {
  const { isMobile } = useSidebar();

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

  const promotionalBanners = useMemo(() => {
    return banners.filter((banner) => banner.type === "promotional");
  }, [banners]);

  useEffect(() => {
    if (slider && promotionalBanners.length > 1) {
      startAutoplay();
    }
    return () => stopAutoplay();
  }, [slider, startAutoplay, stopAutoplay, promotionalBanners.length]);

  const handleMouseEnter = () => stopAutoplay();
  const handleMouseLeave = () => {
    if (promotionalBanners.length > 1) startAutoplay();
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={sliderRef} className="keen-slider rounded-lg overflow-hidden">
        {promotionalBanners.length > 0 ? (
          promotionalBanners.map((b, i) => (
            <div key={"banner" + i} className="keen-slider__slide relative">
              <img
                src={b.url}
                alt="banner"
                style={{ width: "100%", height: isMobile ? 300 : 500 }}
              />
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

export default HomeBannerSliderInner;
