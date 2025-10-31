import { lazy } from "react";
import { getTranslations } from "@/i18n/server";
import { TranslationProvider } from "@/providers/TranslationProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import MobileSidebar from "../partials/Sidebar";
import { CartProvider } from "@/providers/AddCartContext";
import { WishlistProvider } from "@/providers/AddWishlistContext";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ChatProvider } from "@/providers/ChatProvider";
const ChatButton = lazy(() => import("@/app/components/ChatWithSupport"));

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const translations = await getTranslations(locale || "en", "common");

  return (
    <ThemeProvider defaultTheme="light" storageKey="coffee-solutions-theme">
      <TranslationProvider translations={translations}>
        <LanguageProvider initialLanguage={locale}>
          <CartProvider locale={locale}>
            <WishlistProvider>
              <SidebarProvider defaultOpen={false}>
                <MobileSidebar />
                <div
                  className={`w-full dark:bg-background`}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  {children}
                </div>
                <ChatProvider>
                  <ChatButton />
                </ChatProvider>
              </SidebarProvider>
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}
