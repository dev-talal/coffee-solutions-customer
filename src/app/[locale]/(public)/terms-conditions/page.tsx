import { getTranslations } from "@/i18n/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermSection {
  title: string;
  steps?: string[];
}

interface Translations {
  terms_and_conditions: {
    title: string;
    intro: string;
    agreement: string;
    card_header_1: string;
    card_header_2: string;
    sections: {
      [key: string]: TermSection;
    };
  };
}

export default async function TermsConditions({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale, "common");

  const translated = t as Translations;

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold  text-foreground">
          {translated.terms_and_conditions.title}
        </h1>
        <p className="text-lg text-foreground">
          {translated.terms_and_conditions.intro}
        </p>
        <p>{translated.terms_and_conditions.agreement}</p>
      </section>
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <p>{translated.terms_and_conditions.card_header_1}</p>
          <p>{translated.terms_and_conditions.card_header_2}</p>
        </CardHeader>
        <CardContent className="mb-4">
          <ScrollArea className="h-[70vh] pr-4">
            <div
              dir={locale === "ar" ? "rtl" : "ltr"}
              className="space-y-6 leading-relaxed md:px-6 lg:px-7 xl:px-8"
            >
              {Object.keys(translated.terms_and_conditions.sections).map(
                (key) => {
                  const section = translated.terms_and_conditions.sections[key];

                  return (
                    <section key={key}>
                      <h3 className="font-semibold text-xl mb-2">
                        {section.title}
                      </h3>
                      {section.steps ? (
                        <ul className="list-disc list-inside space-y-1">
                          {section.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  );
                }
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
