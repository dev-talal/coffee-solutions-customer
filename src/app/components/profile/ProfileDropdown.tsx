"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle } from "lucide-react";
import { useTranslation } from "@/providers/TranslationProvider";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { DynamicIcon } from "lucide-react/dynamic";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import LogoutDialog from "@/app/components/common/LogoutDialog";
import { useAuthCheck } from "@/hooks/auth-check";

export default function ProfileDropdown() {
  const { user, logout, actionLoader, isAuthenticated, loading } =
    useAuthCheck();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const params = useParams();
  const locale = params.locale || "en";
  const isRtl = locale === "ar";
  const t = useTranslation();

  const handleLogout = async () => {
    await logout();
    setConfirmOpen(false);
    setOpen(false);
  };

  const Avatar = () => {
    if (user?.profile) {
      return (
        <Image
          src={user.profile}
          alt={`${user.first_name} ${user.last_name}`}
          width={40}
          height={40}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
        <DynamicIcon name="circle-user-round" />
      </div>
    );
  };

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/${locale}/auth/login`}
            className="text-foreground p-2 rounded-full hover:bg-accent flex items-center justify-center h-10 w-10"
          >
            <DynamicIcon name="circle-user-round" />
          </Link>
        </TooltipTrigger>
        <TooltipContent sideOffset={4}>{t("login")}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            className="flex items-center gap-2 rounded-full px-1 py-1"
          >
            <Avatar />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          side="bottom"
          className="w-55 p-1 rounded-xl shadow-lg border bg-card z-50 mt-8 font-semibold max-h-60 overflow-y-auto "
          dir={isRtl ? "rtl" : "ltr"}
        >
          <Link href={`/${locale}/profile`} className="block ">
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm hover:bg-coffee-brown hover:text-white"
            >
              <UserCircle className="w-4 h-4 mr-2" />
              {t("profile")}
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 text-sm text-destructive hover:bg-coffee-brown hover:text-white"
            onClick={() => {
              setConfirmOpen(true);
              setOpen(false);
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("logout")}
          </Button>
        </PopoverContent>
      </Popover>

      <LogoutDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onLogout={handleLogout}
        actionLoader={actionLoader}
      />
    </>
  );
}
