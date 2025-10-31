import { getTranslations } from "@/i18n/server";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Coffee Solutions",
  description:
    "Read our comprehensive privacy policy to understand how Coffee Solutions handles your personal data and protects your privacy.",
  keywords: [
    "privacy policy",
    "data protection",
    "coffee solutions",
    "Saudi Arabia",
  ],
};

export default async function PrivacyPolicyPage({
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
          {t.privacy_policy_title}
        </h1>
        <p className="text-lg text-foreground">
          {t.privacy_policy_description}
        </p>
      </section>

      <div className="space-y-6">
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-sm leading-relaxed space-y-4">
            <p>{t.privacy_policy_intro}</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold">{t.what_data_we_use}</h2>
          </CardHeader>
          <CardContent className="px-6 text-sm leading-relaxed">
            <p>{t.what_data_description}</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold">{t.how_it_is_used}</h2>
          </CardHeader>
          <CardContent className="px-6 text-sm leading-relaxed">
            <ul className="list-disc list-inside space-y-2">
              <li>{t.use_case_1}</li>
              <li>{t.use_case_2}</li>
              <li>{t.use_case_3}</li>
              <li>{t.use_case_4}</li>
              <li>{t.use_case_5}</li>
              <li>{t.use_case_6}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
