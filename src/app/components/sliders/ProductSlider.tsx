"use client";
import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import {
  useKeenSlider,
  KeenSliderInstance,
  KeenSliderOptions,
} from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ProductCard from "../ProductCard";
import { DynamicIcon } from "lucide-react/dynamic";
import { Product } from "@/types/product";
import ViewAllButton from "../ViewAllButton";
import { useParams } from "next/navigation";
import ProductDetailModal from "../common/modal/ProductDetailModal";
import { cn } from "@/lib/utils";

function getPerView(instance: KeenSliderInstance | null): number {
  if (!instance) return 1;

  const slides = instance.options.slides;
  if (slides && typeof slides === "object" && "perView" in slides) {
    const perView = slides.perView;
    return typeof perView === "number" ? perView : 1;
  }

  return 1;
}

const ProductSlider = ({
  products,
  viewAllLink,
  show_promotion = false,
  show_only_promotion = false,
}: {
  products: Product[];
  viewAllLink?: string;
  show_promotion?: boolean;
  show_only_promotion?: boolean;
}) => {
  const [perView, setPerView] = useState(1);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const params = useParams();
  const locale = params.locale || "en";

  const isRtl = locale === "ar";

  const filteredProducts = useMemo(() => {
    if (show_only_promotion) {
      return products.filter((p) => Number(p.discount_percent) > 0);
    }
    if (show_promotion) {
      return products;
    }
    return products;
  }, [products, show_promotion, show_only_promotion]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(
    (slider: KeenSliderInstance | null) => {
      stopAutoplay();
      if (!slider) return;

      const currentPerView = getPerView(slider);
      setPerView(currentPerView);

      if (filteredProducts.length > currentPerView) {
        autoplayRef.current = setInterval(() => slider.next(), 3000);
      }
    },
    [filteredProducts, stopAutoplay]
  );

  const options: KeenSliderOptions = {
    loop: true,
    slides: { perView: 5, spacing: 16 },
    rtl: isRtl,
    breakpoints: {
      "(min-width: 1281px)": { slides: { perView: 5, spacing: 10 } },
      "(max-width: 1280px)": { slides: { perView: 4, spacing: 10 } },
      "(max-width: 1024px)": { slides: { perView: 3, spacing: 10 } },
      "(max-width: 768px)": { slides: { perView: 2, spacing: 10 } },
      "(max-width: 640px)": { slides: { perView: 1, spacing: 10 } },
    },
    created(slider) {
      startAutoplay(slider);
    },
    updated(slider) {
      startAutoplay(slider);
    },
    optionsChanged(slider) {
      startAutoplay(slider);
    },
  };

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(options);

  useEffect(() => {
    return () => stopAutoplay();
  }, [stopAutoplay]);

  useEffect(() => {
    const handler = () => {
      setOpen(false);
    };

    window.addEventListener("productAdded", handler);

    return () => {
      window.removeEventListener("productAdded", handler);
    };
  }, []);

  return (
    <div className="space-y-22">
      <div className="flex flex-col space-y-10">
        {filteredProducts.length > perView && (
          <div
            className={cn("flex  justify-center", {
              "flex-row-reverse": isRtl,
              "space-x-3": isRtl,
            })}
          >
            <button
              onClick={() => {
                stopAutoplay();
                if (isRtl) {
                  slider.current?.next();
                } else {
                  slider.current?.prev();
                }
              }}
              className={cn(
                "bg-coffee-brown cursor-pointer dark:bg-white dark:text-coffee-brown text-white shadow p-2 rounded-full",
                {
                  "ms-3": isRtl,
                  "me-3": !isRtl,
                }
              )}
            >
              <DynamicIcon name="chevron-left" className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                stopAutoplay();
                if (isRtl) {
                  slider.current?.prev();
                } else {
                  slider.current?.next();
                }
              }}
              className="bg-coffee-brown cursor-pointer dark:bg-white dark:text-coffee-brown text-white shadow p-2 rounded-full"
            >
              <DynamicIcon name="chevron-right" className="w-5 h-5" />
            </button>
          </div>
        )}
        <div
          className="relative"
          onMouseEnter={stopAutoplay}
          onMouseLeave={() => startAutoplay(slider.current)}
        >
          <div ref={sliderRef} className="keen-slider">
            {filteredProducts.map((item, i) => (
              <div
                key={i}
                className="keen-slider__slide flex flex-col items-center "
              >
                <ProductCard
                  product={item}
                  onButtonClick={() => {
                    setOpen(true);
                    setSelectedProduct(item);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        {viewAllLink && <ViewAllButton link={viewAllLink} />}
      </div>
      {selectedProduct && open && (
        <ProductDetailModal
          open={open}
          onClose={() => setOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default ProductSlider;
