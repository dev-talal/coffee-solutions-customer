"use client";

import Pageloader from "@/app/components/Pageloader";
import Footer from "@/app/partials/Footer";
import Navbar from "@/app/partials/Navbar";
import { useAuthCheck } from "@/hooks/auth-check";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, clearToken, user } = useAuthCheck();

  if (loading) return <Pageloader />;
  if (!isAuthenticated) clearToken();

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
