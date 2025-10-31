"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useProductImage } from "@/providers/ProductImageProvider";
import { useTranslation } from "@/providers/TranslationProvider";
import { useRouter } from "nextjs-toploader/app";
import clsx from "clsx";
import { useWishlist } from "@/providers/AddWishlistContext";
import { useAuthCheck } from "@/hooks/auth-check";
import { useParams } from "next/navigation";

type WishlistButtonProps = {
  product: { image: string; id: number; isLiked: boolean };
  tooltip?: string;
  className?: string;
  liked?: boolean;
  onLikedChange?: (id: number, liked: boolean) => void;
};

export default function WishlistButton({
  product,
  tooltip,
  className,
  liked,
  onLikedChange,
}: WishlistButtonProps) {
  const t = useTranslation();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const { wishlistIconRef, toggleWishlist, loading } = useWishlist();
  const { isAuthenticated } = useAuthCheck();
  const { imgRef } = useProductImage();

  const [isFavorite, setIsFavorite] = useState<boolean>(
    liked !== undefined ? liked : product.isLiked
  );

  useEffect(() => {
    setIsFavorite(liked !== undefined ? liked : product.isLiked);
  }, [product.id, liked, product.isLiked]);

  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = product.image;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
  }, [product.image]);

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`);
      return;
    }

    try {
      await toggleWishlist(product.id, !isFavorite);
      const newFavorite = !isFavorite;
      setIsFavorite(newFavorite);
      if (onLikedChange) {
        onLikedChange(product.id, newFavorite);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      return;
    }

    if (isFavorite || !imgRef.current || !wishlistIconRef.current) return;

    const imgRect = imgRef.current.getBoundingClientRect();
    const wishlistRect = wishlistIconRef.current.getBoundingClientRect();

    const flyImg = document.createElement("img");
    flyImg.src = product.image;
    Object.assign(flyImg.style, {
      position: "fixed",
      left: `${imgRect.left}px`,
      top: `${imgRect.top}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
      zIndex: "9999",
      borderRadius: "8px",
    });
    document.body.appendChild(flyImg);

    const dx =
      wishlistRect.left +
      wishlistRect.width / 2 -
      (imgRect.left + imgRect.width / 2);
    const dy =
      wishlistRect.top +
      wishlistRect.height / 2 -
      (imgRect.top + imgRect.height / 2);

    const animation = flyImg.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.1)`, opacity: 0.5 },
      ],
      { duration: 800, easing: "ease-in-out" }
    );

    animation.onfinish = () => {
      flyImg.remove();
      wishlistIconRef.current?.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.2)" },
          { transform: "scale(1)" },
        ],
        { duration: 300, easing: "ease-in-out" }
      );
    };
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={handleClick}
            className={clsx(
              "p-2 rounded-full transition-colors hover:shadow-sm hover:zoom-in-10 bg-red-100 w-fit",
              className
            )}
            aria-label={tooltip}
            disabled={loading[product.id] || !imageLoaded}
          >
            <DynamicIcon
              name={loading[product.id] ? "loader" : "heart"}
              size={20}
              className={clsx("transition-colors text-red-500", {
                "animate-spin": loading[product.id],
                "fill-red-500": !loading[product.id] && isFavorite,
              })}
            />
          </button>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            className="px-3 py-1.5 text-sm rounded-md bg-black text-white shadow-lg z-3"
          >
            {t("add_to_wishlist")}
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
