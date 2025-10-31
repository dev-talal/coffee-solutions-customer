"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/providers/LanguageProvider";

export function useLanguageSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const { setCurrentLanguage } = useLanguage();

  const switchLanguage = (newLocale: string) => {
    setCurrentLanguage(newLocale);

    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return { switchLanguage };
}
