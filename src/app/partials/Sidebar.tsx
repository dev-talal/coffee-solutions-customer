"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { DynamicIcon } from "lucide-react/dynamic";
import { useTranslation } from "@/providers/TranslationProvider";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import LogoutDialog from "@/app/components/common/LogoutDialog";
import { useAuthCheck } from "@/hooks/auth-check";
import { formatCurrency } from "@/helpers/dataFormat";
import MobileSidebarFooter from "./SidebarFooter";

type ValidLucideIcon = "shopping-cart" | "user-circle" | "heart" | "wallet";

const MobileSidebar = () => {
  const t = useTranslation();
  const { isMobile } = useSidebar();
  const params = useParams();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const locale = mounted ? params.locale || "en" : "en";

  const { logout, actionLoader, isAuthenticated, user } = useAuthCheck();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isRTL = locale === "ar";
  const sidebarSide = isRTL ? "right" : "left";

  const handleLogout = async () => {
    await logout();
    setConfirmOpen(false);
  };

  const menuItems: { href?: string; icon: ValidLucideIcon; label: string }[] =
    mounted
      ? [
          {
            href: !isAuthenticated && isMobile ? "auth/login" : "profile",
            icon: "user-circle",
            label:
              !isAuthenticated && isMobile ? t("login") : t("user_account"),
          },
          { href: "cart", icon: "shopping-cart", label: t("cart") },
          { href: "wishlist", icon: "heart", label: t("wishlist") },
          ...(isAuthenticated
            ? [
                {
                  icon: "wallet" as ValidLucideIcon,
                  label: `${t("wallet")}: ${formatCurrency(
                    Number(user?.credit ?? 0)
                  )} ${t("sar")}`,
                },
              ]
            : []),
        ]
      : [];

  return (
    <>
      <Sidebar side={sidebarSide} style={{ border: 0 }}>
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="h-full justify-between flex flex-col"
        >
          <SidebarContent className="mt-2 pt-4 ">
            <SidebarGroup className="pt-7">
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {menuItems.map(({ href, icon, label }) => (
                    <SidebarMenuItem key={icon + label}>
                      <SidebarMenuButton size="lg" asChild>
                        <div
                          className="flex gap-4 z-10 hover:bg-white rounded-full cursor-pointer"
                          onClick={() => {
                            if (href) {
                              window.location.href = `/${locale}/${href}`;
                            }
                          }}
                        >
                          <DynamicIcon name={icon} className="relative z-10" />
                          <span className="relative z-10 text-base">
                            {label}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {mounted && (
            <MobileSidebarFooter
              isRTL={isRTL}
              locale={locale as string}
              setConfirmOpen={setConfirmOpen}
            />
          )}
        </div>
      </Sidebar>
      <LogoutDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onLogout={handleLogout}
        actionLoader={actionLoader}
      />
    </>
  );
};

export default MobileSidebar;
