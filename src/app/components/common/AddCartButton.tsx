"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/AddCartContext";
import { useProductImage } from "@/providers/ProductImageProvider";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "lucide-react/dynamic";

export default function CartButton({
  product,
  title,
  className,
}: {
  product: {
    image: string;
    id: number;
    quantity?: string;
    available?: boolean;
    isBox?: boolean;
  };
  title: string;
  className?: string;
}) {
  const { cartIconRef, addProductToCart, loading } = useCart();
  const { imgRef } = useProductImage();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = product.image;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
  }, [product.image]);

  const actionLoader = useMemo(() => {
    return loading[product.id] && loading["type"] == "add";
  }, [loading, product.id]);

  const handleAddToCart = async () => {
    if (!imgRef.current || !cartIconRef.current) return;

    try {
      await addProductToCart({
        productId: product.id,
        ...(product.quantity && { quantity: Number(product.quantity) }),
        isBox: product?.isBox || false,
      });
    } catch (_) {
      return;
    }

    const imgRect = imgRef.current.getBoundingClientRect();
    const cartRect = cartIconRef.current.getBoundingClientRect();

    const flyImg = document.createElement("img");
    flyImg.src = product.image;
    flyImg.style.position = "fixed";
    flyImg.style.left = imgRect.left + "px";
    flyImg.style.top = imgRect.top + "px";
    flyImg.style.width = imgRect.width + "px";
    flyImg.style.height = imgRect.height + "px";
    flyImg.style.zIndex = "9999";
    flyImg.style.borderRadius = "8px";

    document.body.appendChild(flyImg);

    const dx =
      cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
    const dy =
      cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);

    const animation = flyImg.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.1)`, opacity: 0.5 },
      ],
      { duration: 800, easing: "ease-in-out" }
    );

    animation.onfinish = () => {
      flyImg.remove();

      cartIconRef.current?.animate(
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
    <Button
      className={cn("text-white  w-full mt-2", className, {
        "bg-coffee-brown hover:bg-amber-400 cursor-pointer": product.available,
        "opacity-50 cursor-not-allowed bg-red-500": !product.available,
      })}
      onClick={product.available ? handleAddToCart : undefined}
      disabled={actionLoader || !product?.available}
    >
      <DynamicIcon
        name={actionLoader ? "loader" : "shopping-cart"}
        className={cn("w-5 h-5", actionLoader ? "animate-spin" : "")}
      />
      {title}
    </Button>
  );
}
