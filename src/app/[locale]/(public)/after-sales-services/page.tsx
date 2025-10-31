import { Card } from "@/components/ui/card";
import { getTranslations } from "@/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "After-sales Services | Coffee Solutions",
  description:
    "Discover Coffee Solutions' comprehensive after-sales services including free product training, menu assistance, cold beverage support, ice cream product support, and grinder calibration.",
  keywords: [
    "after-sales services",
    "coffee training",
    "menu assistance",
    "grinder calibration",
    "coffee support",
    "Saudi Arabia",
  ],
};

export default async function AfterSalesServices({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale, "common");

  const services = [
    {
      title: t.free_product_training,
      description: t.free_product_training_description,
    },
    {
      title: t.beverage_menu_assistance,
      description: t.beverage_menu_assistance_description,
    },
    {
      title: t.cold_beverage_preparation_support,
      description: t.cold_beverage_preparation_support_description,
    },
    {
      title: t.ice_cream_product_support,
      description: t.ice_cream_product_support_description,
    },
    {
      title: t.grinder_calibration,
      description: t.grinder_calibration_description,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          {t.after_sales_services_title}
        </h1>
        <p className="max-w-2xl mx-auto text-foreground">
          {t.after_sales_services_description}
        </p>
      </section>

      <Card className="max-w-5xl p-6 mx-auto shadow-lg">
        {services.map((service, index) => (
          <section key={index} className="mb-1">
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p>{service.description}</p>
          </section>
        ))}
      </Card>

      <section className="text-center">
        <p className="text-foreground max-w-3xl mx-auto">
          {t.after_sales_contact_message1}{" "}
          <strong className="text-green-500">
            {t.after_sales_contact_message2}
          </strong>{" "}
          {t.after_sales_contact_message3}
        </p>
        <p> {t.after_sales_contact_message4}</p>
      </section>
    </div>
  );
}
