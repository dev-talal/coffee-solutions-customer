import { DynamicIcon } from "lucide-react/dynamic";
import React from "react";

interface SkeletonLoaderProps {
  count?: number;
  type?: "loader" | "product-card";
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  type = "loader",
}) => {
  if (type === "product-card") {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="w-full">
            <div className="text-center">
              <div className="relative max-w-[260px] mx-auto">
                <div className="w-full h-[250px] bg-gray-200 animate-pulse rounded-lg mb-3"></div>

                <div className="h-6 bg-gray-200 animate-pulse rounded mb-3 mx-auto w-3/4"></div>

                <div className="h-5 bg-gray-200 animate-pulse rounded mb-2 mx-auto w-1/2"></div>

                <div className="h-4 bg-gray-200 animate-pulse rounded mb-4 mx-auto w-2/3"></div>

                <div className="h-10 bg-gray-200 animate-pulse rounded w-full mt-4"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      <div className="w-4 h-4 bg-gray-200 animate-pulse rounded">
        <DynamicIcon
          name="loader"
          className="animate-spin h-8 w-8 text-coffee-brown"
        />
      </div>
    </>
  );
};

export default SkeletonLoader;
