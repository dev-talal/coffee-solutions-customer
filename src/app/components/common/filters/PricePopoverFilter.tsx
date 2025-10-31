"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "lucide-react/dynamic";

interface PriceFilterPopoverProps {
  minPrice: number | "";
  maxPrice: number | "";
  onApply: (min: number | "", max: number | "") => void;
  onClear: () => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const PriceFilterPopover = ({
  minPrice,
  maxPrice,
  onApply,
  onClear,
  isRtl,
  t,
}: PriceFilterPopoverProps) => {
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  const [localMin, setLocalMin] = useState<number | "">(minPrice);
  const [localMax, setLocalMax] = useState<number | "">(maxPrice);

  // Sync local state when props change
  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  const handleApply = () => {
    onApply(localMin, localMax);
    setPriceDropdownOpen(false);
  };

  const handleClear = () => {
    setLocalMin("");
    setLocalMax("");
    onClear();
    setPriceDropdownOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{t("filters")}</label>
      <Popover open={priceDropdownOpen} onOpenChange={setPriceDropdownOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent hover:bg-transparent"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <DynamicIcon name="filter" className="w-4 h-4" />
            {t("filters")}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-64 mt-2 z-4"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <h3
            className={`text-sm font-semibold mb-2 ${
              isRtl ? "text-right" : "text-left"
            }`}
          >
            {t("price")}
          </h3>
          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">
                {t("from")}
              </label>
              <Input
                type="number"
                value={localMin}
                onChange={(e) =>
                  setLocalMin(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                placeholder={`0 ${t("sar")}`}
                min={0}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">
                {t("to")}
              </label>
              <Input
                type="number"
                value={localMax}
                onChange={(e) =>
                  setLocalMax(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                placeholder={`10000 ${t("sar")}`}
                min={0}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2" dir={isRtl ? "rtl" : "ltr"}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="bg-transparent hover:bg-transparent"
            >
              {t("clear")}
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="bg-coffee-brown hover:bg-amber-400"
            >
              {t("save")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PriceFilterPopover;
