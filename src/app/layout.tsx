import "./globals.css";
import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

const tajawalSans = Tajawal({
  variable: "--font-tajwal-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  title: "Coffee Solutions",
  description: "Your coffee solutions website",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalizedLocale = locale || "en";

  return (
    <html lang={normalizedLocale} suppressHydrationWarning>
      <body className={tajawalSans.variable}>
        <NextTopLoader showSpinner={false} color="var(--coffee-brown)" />
        <AuthProvider locale={normalizedLocale}>{children}</AuthProvider>
        <Toaster toastOptions={{ position: "top-right" }} />
      </body>
    </html>
  );
}
