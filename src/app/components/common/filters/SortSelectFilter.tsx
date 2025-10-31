"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortSelectProps {
  sortOption: string;
  setSortOption: (value: string) => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const SortSelect = ({
  sortOption,
  setSortOption,
  isRtl,
  t,
}: SortSelectProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor="sortOption">
        {t("sort_by")}
      </label>
      <Select
        value={sortOption}
        onValueChange={setSortOption}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder={t("sort_by")} />
        </SelectTrigger>
        <SelectContent dir={isRtl ? "rtl" : "ltr"}>
          <SelectItem value="recent-products">{t("newest")}</SelectItem>
          <SelectItem value="popular-products">{t("most_popular")}</SelectItem>
          <SelectItem value="low-to-high">{t("price_low_to_high")}</SelectItem>
          <SelectItem value="high-to-low">{t("price_high_to_low")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortSelect;
