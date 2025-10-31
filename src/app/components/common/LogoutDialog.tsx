"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/TranslationProvider";
import { DynamicIcon } from "lucide-react/dynamic";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
  actionLoader: boolean;
}

export default function LogoutDialog({
  open,
  onOpenChange,
  onLogout,
  actionLoader,
}: LogoutDialogProps) {
  const t = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-sm lg:max-w-md bg-card">
        <DialogHeader className="flex items-center justify-center space-y-4 mt-8">
          <DynamicIcon name="user" className="dark:text-white h-11 w-11" />
          <DialogTitle className="text-2xl font-semibold text-center justify-center">
            {t("logoutDescription")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center gap-2 w-full">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={actionLoader}
            className="bg-transparent rounded-full w-[50%]"
          >
            {t("cancel")}
          </Button>
          <Button
            variant="outline"
            onClick={onLogout}
            disabled={actionLoader}
            className="bg-coffee-brown hover:bg-amber-400 text-white rounded-full hover:text-white w-[50%] flex items-center justify-center gap-2"
          >
            {actionLoader ? (
              <>
                <DynamicIcon name="loader" className="w-4 h-4 animate-spin" />
                {t("loggingOut")}
              </>
            ) : (
              t("logout")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
