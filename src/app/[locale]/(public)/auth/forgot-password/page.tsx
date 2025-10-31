"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/app/components/common/FormInput";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormOTPInput } from "@/app/components/common/FormOtpInput";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/providers/TranslationProvider";
import {
  emailSchema,
  EmailValues,
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "@/lib/validations/auth";
import {
  postForgotPasswordEmail,
  postResetPassword,
} from "@/services/apiService";

const ForgotPasswordPage: React.FC = () => {
  const t = useTranslation();
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema(t)),
  });

  const resetForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema(t)),
    defaultValues: { email: savedEmail },
  });

  const handleSendEmail = async (data: EmailValues) => {
    setLoading(true);
    try {
      await postForgotPasswordEmail(data);
      resetForm.setValue("email", data.email);
      setSavedEmail(data.email);
      setIsEmailSent(true);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: ForgotPasswordValues) => {
    setLoading(true);
    try {
      await postResetPassword({ ...data, email: savedEmail });
      router.push(`/${locale}/auth/login`);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center my-12">
      <Card className="w-[375px] lg:w-[420px] drop-shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t("forgotPasswordTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEmailSent ? (
            <FormProvider {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleSendEmail)}>
                <div className="space-y-2">
                  <FormInput
                    id="email"
                    name="email"
                    icon="mail"
                    type="email"
                    label={t("email")}
                    placeholder={t("emailPlaceholder")}
                    className="rounded-full"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-coffee-brown text-white hover:bg-amber-400 mt-4"
                >
                  {t("sendResetLink")}
                </Button>
              </form>
            </FormProvider>
          ) : (
            <FormProvider {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(handleResetPassword)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-display">{t("email")}</Label>
                    <input
                      id="email-display"
                      name="email"
                      type="email"
                      defaultValue={savedEmail}
                      readOnly
                      disabled
                      placeholder={t("emailPlaceholder")}
                      className="rounded-full bg-gray-100 cursor-not-allowed border border-gray-300 px-3 py-2 w-full dark:text-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <FormInput
                      id="password"
                      name="password"
                      label={t("newPassword")}
                      type="password"
                      isPassword
                      className="rounded-full"
                      placeholder={t("enterNewPassword")}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormInput
                      id="confirmPassword"
                      name="password_confirmation"
                      label={t("confirmPassword")}
                      type="password"
                      isPassword
                      className="rounded-full"
                      placeholder={t("confirmNewPassword")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp">{t("verificationCode")}</Label>
                    <FormOTPInput name="otp" />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-coffee-brown hover:bg-amber-400 text-white rounded-full"
                  >
                    {t("resetPassword")}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}

          <div className="text-center">
            <Link
              href={`/${locale}/auth/login`}
              className="text-sm text-primary hover:underline"
            >
              {t("backToLogin")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
