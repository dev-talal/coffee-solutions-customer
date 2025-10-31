"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/TranslationProvider";
import { DynamicIcon } from "lucide-react/dynamic";
import { useState } from "react";

const QuantityCounter = ({
  quantity,
  maxVal = 1,
  setQuantity,
}: {
  quantity: number;
  maxVal: number;
  setQuantity: (quantity: number) => void;
}) => {
  const t = useTranslation();
  const [inputValue, setInputValue] = useState<string>(String(quantity));

  const updateQuantity = (quan: number) => {
    if (quan > maxVal) {
      setQuantity(maxVal);
      setInputValue(String(maxVal));
    } else if (quan < 1) {
      setQuantity(1);
      setInputValue("1");
    } else {
      setQuantity(quan);
      setInputValue(String(quan));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (val === "") return;
    setQuantity(Number(val));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      !e.target.value ||
      e.target.value === "" ||
      Number(e.target.value) < 1
    ) {
      setQuantity(1);
      setInputValue("1");
    } else {
      setQuantity(Number(e.target.value));
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2 py-4">
        <Button
          size="icon"
          className="rounded-full bg-coffee-brown hover:bg-amber-400 text-white"
          onClick={() => updateQuantity(quantity - 1)}
          disabled={quantity <= 1}
        >
          <DynamicIcon name={"minus"} className={"w-4 h-4"} />
        </Button>

        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="[appearance:textfield] w-[40px] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
        />

        <Button
          size="icon"
          onClick={() => updateQuantity(quantity + 1)}
          className="rounded-full bg-coffee-brown hover:bg-amber-400 text-white"
          disabled={quantity >= maxVal}
        >
          <DynamicIcon name={"plus"} className={"w-4 h-4"} />
        </Button>
      </div>
      {quantity > maxVal && (
        <p className="text-red-500 text-sm font-semibold">
          {t("available_stock")}&nbsp;{maxVal}
        </p>
      )}
    </>
  );
};

export default QuantityCounter;
