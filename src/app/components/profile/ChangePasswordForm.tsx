"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FormInput } from "@/app/components/common/FormInput";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/TranslationProvider";
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { postChangePassword } from "@/services/apiService";
import { useState } from "react";
import { DynamicIcon } from "lucide-react/dynamic";

const ChangePasswordForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const t = useTranslation();

  const methods = useForm<ResetPasswordValues>({
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    resolver: zodResolver(resetPasswordSchema(t)),
  });

  const { handleSubmit } = methods;

  const handlePasswordChange = async (data: ResetPasswordValues) => {
    setLoading(true);
    try {
      await postChangePassword(data);
      methods.reset();
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col my-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        {t("changePassword")}
      </h2>

      <Card className="w-[320px] sm:w-[375px] lg:w-[440px] xl:w-[480px] py-10">
        <CardContent className="mb-2">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(handlePasswordChange)}
              className="space-y-4"
            >
              <div className="space-y-4">
                <FormInput
                  id="currentPassword"
                  name="old_password"
                  label={t("oldPassword")}
                  type="password"
                  isPassword={false}
                  placeholder={t("enterOldPassword")}
                  className="rounded-full "
                />
              </div>
              <div className="space-y-4">
                <FormInput
                  id="newPassword"
                  name="new_password"
                  label={t("newPassword")}
                  type="password"
                  isPassword={true}
                  placeholder={t("enterNewPassword")}
                  className="rounded-full"
                />
              </div>
              <div className="space-y-4">
                <FormInput
                  id="confirmPassword"
                  name="new_password_confirmation"
                  label={t("confirmPassword")}
                  type="password"
                  isPassword={true}
                  placeholder={t("confirmNewPassword")}
                  className="rounded-full"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-coffee-brown hover:bg-amber-400 text-white rounded-full mt-4"
              >
                {loading ? (
                  <DynamicIcon name="loader" className="w-7 h-7 animate-spin" />
                ) : (
                  t("saveChanges")
                )}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordForm;
