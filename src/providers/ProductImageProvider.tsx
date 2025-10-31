"use client";

import { createContext, useContext, useRef, ReactNode, useState } from "react";

type ProductImageContextType = {
  imgRef: React.RefObject<HTMLImageElement | null>;
  currentImage: string;
  setCurrentImage: (image: string) => void;
};

const ProductImageContext = createContext<ProductImageContextType | null>(null);

export function ProductImageProvider({
  children,
  initialImage,
}: {
  children: ReactNode;
  initialImage: string;
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [currentImage, setCurrentImage] = useState(initialImage);

  return (
    <ProductImageContext.Provider
      value={{ imgRef, currentImage, setCurrentImage }}
    >
      {children}
    </ProductImageContext.Provider>
  );
}

export function useProductImage() {
  const ctx = useContext(ProductImageContext);
  if (!ctx)
    throw new Error("useProductImage must be used within ProductImageProvider");
  return ctx;
}
