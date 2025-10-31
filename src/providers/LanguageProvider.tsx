"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage: string;
}) {
  const params = useParams();
  const routeLocale = params.locale as string;

  const [currentLanguage, setCurrentLanguage] = useState(
    routeLocale || initialLanguage
  );

  useEffect(() => {
    if (routeLocale && routeLocale !== currentLanguage) {
      setCurrentLanguage(routeLocale);
    }
  }, [routeLocale, currentLanguage]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
