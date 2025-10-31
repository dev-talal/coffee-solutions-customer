"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DynamicIcon } from "lucide-react/dynamic";
import { useTranslation } from "@/providers/TranslationProvider";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/providers/AddCartContext";
import { formatCurrency } from "@/helpers/dataFormat";
import { useAuthCheck } from "@/hooks/auth-check";
import { useRouter } from "nextjs-toploader/app";
import CartItem from "@/app/components/common/CartItem";
import useCartHook from "@/hooks/cart-hook";
import DeliveryAddressSelect from "@/app/components/common/DeliveryAddressSelect";

type PaymentMethod = "wallet" | "card" | "";

const CartPage = () => {
  const params = useParams();
  const router = useRouter();
  const t = useTranslation();
  const locale = (params?.locale as string) || "en";
  const isRtl = locale === "ar";
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
  const [deliveryAddressValue, setDeliveryAddressValue] = useState<string>("");
  const { user, isAuthenticated } = useAuthCheck();
  const { fetchCart, cartItems, loading, fetchTaxes, placeOrder } = useCart();
  const { calculatedTaxes, subTotalWithoutTax, total } = useCartHook();

  const apiLoader = useMemo(() => {
    return loading.type === "api" && loading.isFetching;
  }, [loading]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login?redirect=${window.location.pathname}`);
      return;
    }
    if (paymentMethod) placeOrder(paymentMethod, deliveryAddressValue);
  };

  useEffect(() => {
    fetchCart();
    fetchTaxes();
  }, [fetchCart, fetchTaxes]);

  useEffect(() => {
    if (!paymentMethod && isAuthenticated && total > 0) {
      setPaymentMethod("wallet");
    }
  }, [isAuthenticated, total, paymentMethod]);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-5">
        <h2 className="text-2xl font-bold">{t("shopping_cart")}</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {apiLoader && cartItems.length === 0 && (
            <DynamicIcon
              name="loader"
              className="w-8 h-8 mx-auto text-coffee-brown animate-spin"
            />
          )}
          {cartItems.length === 0 && !apiLoader ? (
            <div className="text-center space-y-5 mt-8">
              <DynamicIcon
                name="shopping-cart"
                className="w-20 h-20 mx-auto text-gray-400 dark:text-white"
              />
              <h2 className="text-coffee-brown dark:text-white text-xl font-semibold">
                {t("empty_cart")}
              </h2>
            </div>
          ) : (
            cartItems.map((item) => (
              <Card key={item.id} className="px-4 py-0 shadow-md rounded-2xl">
                <CardContent className="flex flex-wrap items-center justify-between space-x-4 p-0">
                  <CartItem item={item} locale={locale} />
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <Card className="h-fit lg:col-span-4 shadow-lg rounded-2xl p-6">
          <CardHeader className="px-0">
            <CardTitle className="text-xl font-bold">
              {t("order_summary")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-0">
            <div className="flex justify-between">
              <span>
                {t("subtotal")}&nbsp;({t("without_tax")})
              </span>
              <span className="font-semibold">
                {formatCurrency(subTotalWithoutTax)} {t("sar")}
              </span>
            </div>
            {calculatedTaxes.map((tax) => (
              <div className="flex justify-between" key={tax.id}>
                <span>
                  {tax.name}&nbsp;({tax.percent}%)
                </span>
                <span className="font-semibold">
                  {formatCurrency(tax.rate)}&nbsp;{t("sar")}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>
                {t("total")}&nbsp;({t("with_tax")})
              </span>
              <span>
                {formatCurrency(total)} {t("sar")}
              </span>
            </div>
            {isAuthenticated && total > 0 && (
              <div className="space-y-2 pt-4">
                <h1 className="font-bold text-lg">{t("payment_method")}</h1>
                <RadioGroup
                  defaultValue="wallet"
                  value={paymentMethod}
                  onValueChange={(val) =>
                    setPaymentMethod(val as PaymentMethod)
                  }
                  dir={isRtl ? "rtl" : "ltr"}
                >
                  {Number(user?.credit ?? 0) > 0 && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet">
                        <DynamicIcon
                          name={"wallet"}
                          className="w-4 h-4 text-coffee-brown dark:text-white"
                        />
                        {t("pay_with_wallet")} (
                        {formatCurrency(Number(user?.credit ?? 0))} {t("sar")})
                      </Label>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">
                      <DynamicIcon
                        name={"credit-card"}
                        className="w-4 h-4 text-coffee-brown dark:text-white"
                      />
                      {t("pay_with_card")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            {cartItems.length > 0 && isAuthenticated && (
              <>
                <DeliveryAddressSelect
                  onChange={setDeliveryAddressValue}
                  value={deliveryAddressValue}
                />
                <Button
                  disabled={loading.isFetching || !deliveryAddressValue}
                  className="w-full text-lg bg-coffee-brown hover:bg-amber-400 text-white cursor-pointer"
                  onClick={handleCheckout}
                >
                  <DynamicIcon
                    name={paymentMethod === "wallet" ? "wallet" : "credit-card"}
                    className="w-5 h-5 text-white"
                  />
                  <span>
                    {paymentMethod === "wallet"
                      ? t("pay_with_wallet")
                      : t("pay_with_card")}
                  </span>
                </Button>
              </>
            )}
            {!isAuthenticated && (
              <Button
                className="w-full text-lg bg-coffee-brown hover:bg-amber-400 text-white cursor-pointer"
                onClick={handleCheckout}
              >
                <span>{t("login_to_checkout")}</span>
              </Button>
            )}
            <Link href={`/${locale}`}>
              <Button
                disabled={loading.isFetching}
                variant="outline"
                className="w-full text-lg cursor-pointer"
              >
                <DynamicIcon name="shopping-cart" className="w-5 h-5" />
                {t("continue_to_shopping")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartPage;
