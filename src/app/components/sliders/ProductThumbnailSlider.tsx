"use client";
import { useProductImage } from "@/providers/ProductImageProvider";
import { ProductImage } from "@/types/product";
import Image from "next/image";

const ProductThumbnailSlider = ({ images }: { images: ProductImage[] }) => {
  const { setCurrentImage } = useProductImage();

  const handleThumbnailClick = (image: string) => {
    setCurrentImage(image);
  };

  return (
    <div className="flex space-x-2 mt-4">
      {images.map((img) => (
        <Image
          key={img.id}
          src={img.image}
          alt={`Thumbnail of ${img.id}`}
          width={100}
          height={100}
          className="w-20 h-20 object-cover cursor-pointer rounded"
          onClick={() => handleThumbnailClick(img.image)}
        />
      ))}
    </div>
  );
};

export default ProductThumbnailSlider;
