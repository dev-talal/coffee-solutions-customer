import { Product } from "@/types/product";
import { useState } from "react";

export default function ProductDescription({
  product,
  isRtl,
}: {
  product: Product;
  isRtl?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const text = isRtl ? product?.ar_description : product?.description;
  const previewLength = 200;

  const shouldTruncate = text && text.length > previewLength;
  const displayText =
    expanded || !shouldTruncate ? text : text.slice(0, previewLength) + "...";

  return (
    <div>
      <p className="text-foreground">{displayText}</p>
      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
