"use client";
import assets from "@/assets";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/providers/TranslationProvider";
import { DynamicIcon } from "lucide-react/dynamic";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { useLanguageSwitch } from "@/hooks/useLanguageSwitch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/AddCartContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWishlist } from "@/providers/AddWishlistContext";
import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useState } from "react";
import { useAuthCheck } from "@/hooks/auth-check";
import ProfileDropdown from "@/app/components/profile/ProfileDropdown";
import { formatCurrency } from "@/helpers/dataFormat";
import ProductSearchBar from "../components/common/ProductSearchBar";

export default function Navbar() {
  const t = useTranslation();
  const { isAuthenticated, user } = useAuthCheck();
  const { isMobile, toggleSidebar } = useSidebar();
  const { cartIconRef, cartCount, fetchCartCount } = useCart();
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
  const { wishlistIconRef } = useWishlist();
  const params = useParams();
  const locale = params.locale || "en";

  const { switchLanguage } = useLanguageSwitch();
  const { theme, setTheme } = useTheme();

  const isRTL = locale === "ar";

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  return (
    <TooltipProvider>
      <div
        className="px-4 border-b py-3 bg-card sticky top-0 left-0 z-10 w-full"
        id="custom-navbar"
      >
        <div className="container mx-auto flex items-center justify-between w-full ">
          {isMobile && (
            <Button
              variant="secondary"
              type="button"
              onClick={() => toggleSidebar()}
              className="w-11 h-11 rounded-full relative cursor-pointer overflow-hidden"
            >
              <DynamicIcon
                name="align-justify"
                className="size-5 rounded-full"
              />
            </Button>
          )}
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}`}
              className="text-sm font-medium text-foreground"
            >
              <Image
                src={assets.img.logo}
                width={250}
                alt="logo"
                priority
                style={{ height: "auto" }}
              />
            </Link>
          </div>
          <div className="mx-auto hidden lg:block">
            <ProductSearchBar locale={locale as string} />
          </div>

          <div className="flex items-center md:gap-4 gap-2 h-12">
            {isMobile && (
              <DynamicIcon
                name="search"
                className="flex-shrink-0"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              />
            )}
            <div ref={cartIconRef} className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/${locale}/cart`}
                    className="text-foreground p-2 rounded-full hover:bg-accent relative flex items-center justify-center h-10 w-10"
                  >
                    <DynamicIcon name="shopping-cart" />
                    {typeof cartCount === "number" && (
                      <Badge
                        className="absolute top-0 right-0 -mt-1 -mr-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                        variant="destructive"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("cart")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {!isMobile && (
              <div ref={wishlistIconRef} id="wishlist-icon">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/${locale}/wishlist`}
                      className="text-foreground p-2 rounded-full hover:bg-accent flex items-center justify-center h-10 w-10"
                    >
                      <DynamicIcon name="heart" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("wishlist")}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleTheme}
                  className="text-foreground p-2 rounded-full hover:bg-accent flex items-center justify-center h-10 w-10"
                >
                  <DynamicIcon name={theme === "light" ? "moon" : "sun"} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("theme")}</p>
              </TooltipContent>
            </Tooltip>
            {!isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="text-foreground p-2 rounded-full hover:bg-accent flex items-center justify-center h-10 w-10"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <DynamicIcon name="globe" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("language")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className={`w-40 z-3 mt-8 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  align={isRTL ? "start" : "end"}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => switchLanguage("en")}
                      className={`cursor-pointer flex items-center gap-2 ${
                        isRTL ? "flex-row-reverse" : ""
                      } ${locale === "en" ? "bg-coffee-brown text-white" : ""}`}
                    >
                      {t("english")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => switchLanguage("ar")}
                      className={`cursor-pointer flex items-center gap-2 ${
                        isRTL ? "flex-row-reverse" : ""
                      } ${locale === "ar" ? "bg-coffee-brown text-white" : ""}`}
                    >
                      {t("arabic")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!isMobile && isAuthenticated && (
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={`flex flex-row items-center gap-2 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <DynamicIcon name="wallet" className="w-6 h-6" />
                    <span className="font-semibold">
                      {formatCurrency(Number(user?.credit ?? 0))}
                      &nbsp;{t("sar")}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("wallet")}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {!isMobile && <ProfileDropdown />}
          </div>
        </div>
        {isMobile && showMobileSearch && (
          <ProductSearchBar locale={locale as string} />
        )}
      </div>
    </TooltipProvider>
  );
}
