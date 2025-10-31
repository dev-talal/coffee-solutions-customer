"use client";
import React from "react";
import { useTranslation } from "@/providers/TranslationProvider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { DynamicIcon } from "lucide-react/dynamic";
import { ProductUnit } from "@/types/product";

const PieceBoxRadio = ({
  onChange,
  isRtl,
  value = "0",
  disabled = false,
  perBox = "1",
  productUnit,
  uomUnit,
}: {
  onChange: (val: "0" | "1") => void;
  isRtl: boolean;
  value?: "0" | "1";
  disabled?: boolean;
  perBox?: string;
  productUnit: ProductUnit;
  uomUnit: ProductUnit;
}) => {
  const t = useTranslation();

  return (
    <RadioGroup
      defaultValue={"0"}
      value={value}
      onValueChange={(val) => onChange(val as "0" | "1")}
      dir={isRtl ? "rtl" : "ltr"}
      className="flex items-center space-x-3"
      disabled={disabled}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="0" id="piece" />
        <Label htmlFor="piece">
          <DynamicIcon
            name={"shopping-bag"}
            className="w-5 h-5 text-coffee-brown   dark:text-white"
          />
          {isRtl ? productUnit.ar_name : productUnit.name}
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1" id="box" />
        <Label htmlFor="box">
          <DynamicIcon
            name={"package"}
            className="w-5 h-5 text-coffee-brown dark:text-white"
          />
          {isRtl ? uomUnit.ar_name : uomUnit.name}&nbsp;({perBox}&nbsp;
          {t("pieces")})
        </Label>
      </div>
    </RadioGroup>
  );
};

export default PieceBoxRadio;
