import { Card } from "@/components/ui/card";
import { getTranslations } from "@/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exchange & Return Policy | Coffee Solutions",
  description:
    "Read our comprehensive exchange and return policy to understand your rights and our procedures for product returns and exchanges.",
  keywords: [
    "exchange policy",
    "return policy",
    "refund policy",
    "coffee solutions",
    "Saudi Arabia",
  ],
};

export default async function ExchangeReturnPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale, "common");

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          {t.exchange_return_policy_title}
        </h1>
      </section>

      <Card className="max-w-5xl p-6 mx-auto shadow-lg">
        <section className="mb-1">
          <h3 className="text-xl font-semibold mb-2">
            {t.exchange_return_policy_description}
          </h3>
          <ul className="list-disc list-inside space-y-2  text-foreground">
            <li>
              {t.contact_us_within} <strong>{t.hours_48}</strong>{" "}
              {t.contact_within_48_hours_of_delivery}
            </li>
            <li>{t.product_condition_requirement}</li>
            <li>
              {t.shipping_error_policy} <strong>{t.we_pay_shipping}</strong>.
            </li>
            <li>{t.customer_error_policy}</li>
            <p className="italic">
              <strong>{t.replacement_condition_note}</strong>
            </p>
            <li>
              {t.refund_process1} <strong>{t.refund_process2}</strong>{" "}
              {t.refund_process3}
            </li>
            <li>{t.ground_coffee_policy}</li>
            <li>
              {t.return_timeframe1} <strong>{t.return_timeframe2}</strong>{" "}
              {t.return_timeframe3} <strong>{t.return_timeframe4}</strong>{" "}
              {t.return_timeframe5}
            </li>
          </ul>
        </section>

        <section className="mb-1">
          <h3 className="text-xl font-semibold mb-2">{t.order_shortage}</h3>
          <p className=" text-foreground">{t.order_shortage_description}</p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">{t.order_excess}</h3>
          <p className=" text-foreground">{t.order_excess_description}</p>
        </section>
      </Card>
    </div>
  );
}
