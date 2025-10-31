import { useCart } from "@/providers/AddCartContext";
import { useMemo } from "react";

const useCartHook = () => {
  const { cartItems, taxes } = useCart();

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          item.is_box.toString() === "0"
            ? sum + item.product.final_price * Number(item.quantity)
            : sum +
              Number(item.product.pieces_per_box) *
                item.product.final_price *
                Number(item.quantity),
        0
      ),
    [cartItems]
  );

  const calculatedTaxes = useMemo(() => {
    return taxes.map((tax) => {
      const taxRate = Number(tax.rate);
      const taxAmount = (subtotal * taxRate) / 100;

      return {
        ...tax,
        percent: tax.rate,
        rate: taxAmount,
      };
    });
  }, [taxes, subtotal]);

  const taxSum = useMemo(() => {
    return calculatedTaxes.reduce((sum, tax) => sum + Number(tax.rate), 0);
  }, [calculatedTaxes]);

  const subTotalWithoutTax = useMemo(() => {
    return subtotal - taxSum;
  }, [subtotal, taxSum]);

  const total = useMemo(() => {
    return subTotalWithoutTax + taxSum;
  }, [subTotalWithoutTax, taxSum]);

  return {
    subtotal,
    calculatedTaxes,
    taxSum,
    subTotalWithoutTax,
    total,
  };
};

export default useCartHook;
