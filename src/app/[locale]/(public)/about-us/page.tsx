import { getTranslations } from "@/i18n/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Coffee Solutions",
  description:
    "Learn about Coffee Solutions - Saudi Arabia's leading coffee services company providing premium coffee beans, brewing equipment, and comprehensive support services.",
  keywords: ["about us", "coffee solutions", "coffee services", "Saudi Arabia"],
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale, "common");

  const bulletPoints = [
    t.high_quality_products,
    t.best_prices,
    t.delivery_service,
    t.international_products,
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold  text-foreground">
          {t.about_us_title}
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-foreground leading-relaxed">
          {t.about_us_description}
        </p>
      </section>

      <Card className="rounded-2xl p-8 shadow-lg">
        <CardHeader className="text-3xl font-semibold ">
          {t.our_vision}
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed">{t.our_vision_description}</p>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-3xl font-semibold text-center  text-foreground mb-8">
          {t.what_distinguishes_us}
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {bulletPoints.map((point, index) => (
            <Card key={index} className="rounded-2xl shadow-lg">
              <CardContent>
                <p className=" text-sm leading-relaxed">{point}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
