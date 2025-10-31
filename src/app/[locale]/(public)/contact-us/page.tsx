import { getTranslations } from "@/i18n/server";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DynamicIcon } from "lucide-react/dynamic";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | Coffee Solutions",
  description:
    "Get in touch with Coffee Solutions - Saudi Arabia's leading coffee services company. Find our address, email, and phone number for all your coffee needs.",
  keywords: [
    "contact us",
    "coffee solutions",
    "coffee services",
    "Saudi Arabia",
  ],
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale, "common");

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold  text-foreground">
          {t.contact_us_title}
        </h1>
        <p className="text-lg  text-foreground">{t.contact_us_description}</p>
      </section>

      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto py-4">
        <Card className="p-4 rounded-xl shadow-lg">
          <CardHeader>
            <div className="flex flex-row items-center gap-2">
              <DynamicIcon
                name="map-pin"
                className="w-6 h-6 text-primary flex-shrink-0"
              />
              <h3 className="text-lg font-semibold ">{t.address}</h3>
            </div>
          </CardHeader>
          <CardContent>
            <Link
              href="https://www.google.com/maps?q=3539+Makkah+Al+Mukarramah+Branch+Road,+8232,+Al+Rabwah,+Riyadh+12813,+Saudi+Arabia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm leading-relaxed hover:underline"
            >
              {t.address_details}
            </Link>
          </CardContent>
        </Card>

        <Card className="p-4 rounded-xl shadow-lg">
          <CardHeader>
            <div className="flex flex-row items-center gap-2">
              <DynamicIcon
                name="mail"
                className="w-6 h-6 text-primary flex-shrink-0"
              />
              <h3 className="text-lg font-semibold">{t.email}</h3>
            </div>
          </CardHeader>
          <CardContent>
            <Link
              href="mailto:info@suncafe.com.sa"
              className="text-sm hover:underline"
            >
              {t.email_address}
            </Link>
          </CardContent>
        </Card>

        <Card className="p-4 rounded-xl shadow-lg">
          <CardHeader>
            <div className="flex flex-row items-center gap-2">
              <DynamicIcon
                name="phone"
                className="w-6 h-6 text-foreground flex-shrink-0"
              />
              <h3 className="text-lg font-semibold">{t.mobile_number}</h3>
            </div>
          </CardHeader>
          <CardContent>
            <Link
              href="tel:+966531110324"
              className="text-sm hover:underline"
              dir="ltr"
            >
              +966 531110324
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
