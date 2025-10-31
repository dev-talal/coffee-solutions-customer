"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/providers/TranslationProvider";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

export const profileTabsList = (t: { (key: string): string }) => [
  { key: "profile", label: t("profile") },
  { key: "password", label: t("changePassword") },
  { key: "orders", label: t("orderHistory") },
  { key: "wallet", label: t("wallet") },
  { key: "delivery", label: t("deliveryAddress") },
];

export default function ProfileTabs({
  active = "profile",
}: {
  active?: string;
}) {
  const locale = useParams()?.locale || "en";

  const navigate = useRouter();
  const t = useTranslation();

  const buttonClasses = `
    h-fit py-1 px-4 font-semibold text-sm rounded-md sm:rounded-full border hover:bg-gray-100 hover:text-black cursor-pointer drop-shadow-sm
  `;

  return (
    <div className="border-b px-8 py-4 bg-white dark:bg-transparent rounded-t-md">
      <div className="flex flex-col sm:flex-row gap-2 text-sm font-medium">
        {profileTabsList(t).map(({ key, label }) => {
          const isActive = key === active;

          return (
            <button
              key={key}
              onClick={() => navigate.push(`/${locale}/profile?tab=${key}`)}
              className={cn(buttonClasses, {
                "bg-gray-100 text-black": isActive,
                "bg-transparent text-foreground": !isActive,
              })}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
