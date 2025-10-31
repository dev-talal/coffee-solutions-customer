"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthCheck } from "@/hooks/auth-check";
import { useLanguageSwitch } from "@/hooks/useLanguageSwitch";
import { useTranslation } from "@/providers/TranslationProvider";
import { DynamicIcon } from "lucide-react/dynamic";
import { useState, useEffect } from "react";

const MobileSidebarFooter = ({
  isRTL,
  locale,
  setConfirmOpen,
}: {
  isRTL: boolean;
  locale: string;
  setConfirmOpen: (open: boolean) => void;
}) => {
  const t = useTranslation();
  const { switchLanguage } = useLanguageSwitch();
  const { isMobile } = useSidebar();
  const { isAuthenticated } = useAuthCheck();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground justify-between flex"
              >
                <div className="flex items-center gap-2">
                  <DynamicIcon name="globe" />
                  {t("language")}
                </div>
                <DynamicIcon name="chevrons-left-right" className="h-4 w-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`min-w-56 rounded-lg ${
                isRTL ? "text-right" : "text-left"
              }`}
              side={isMobile ? "bottom" : "right"}
              align={isRTL ? "start" : "end"}
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => switchLanguage("en")}
                  className={`cursor-pointer flex items-center gap-2 ${
                    isRTL ? "flex-row-reverse text-right" : ""
                  } ${locale === "en" ? "bg-coffee-brown text-white" : ""}`}
                >
                  {t("english")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => switchLanguage("ar")}
                  className={`cursor-pointer flex items-center gap-2 ${
                    isRTL ? "flex-row-reverse text-right" : ""
                  } ${locale === "ar" ? "bg-coffee-brown text-white" : ""}`}
                >
                  {t("arabic")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
        <>
          {isAuthenticated && (
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="text-white hover:bg-white hover:text-coffee-brown"
                onClick={() => setConfirmOpen(true)}
              >
                <DynamicIcon name="log-out" className="mr-2" />
                {t("logout")}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default MobileSidebarFooter;
