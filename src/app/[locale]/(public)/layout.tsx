"use client";

import Pageloader from "@/app/components/Pageloader";
import Footer from "@/app/partials/Footer";
import Navbar from "@/app/partials/Navbar";
import { useAuthCheck } from "@/hooks/auth-check";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loading } = useAuthCheck();

  if (loading) return <Pageloader />;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
