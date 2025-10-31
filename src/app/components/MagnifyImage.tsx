"use client";
import Image from "next/image";
import { useState } from "react";
import { useProductImage } from "@/providers/ProductImageProvider";

export default function MagnifyImage({ alt }: { alt: string }) {
  const [backgroundPosition, setBackgroundPosition] = useState("center");
  const { imgRef, currentImage } = useProductImage();
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setBackgroundPosition("center")}
      className="relative w-full h-[500px] rounded-2xl shadow-lg cursor-zoom-in overflow-hidden"
      style={{
        backgroundImage: `url(${currentImage})`,
        backgroundSize: "200%",
        backgroundPosition,
        backgroundRepeat: "no-repeat",
        transition: "background-position 0.1s ease",
      }}
    >
      {backgroundPosition === "center" && (
        <Image
          src={currentImage}
          alt={alt}
          fill
          className="object-contain bg-card"
          ref={imgRef}
        />
      )}
    </div>
  );
}
