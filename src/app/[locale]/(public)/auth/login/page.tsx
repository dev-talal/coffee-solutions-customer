"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormInput } from "@/app/components/common/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/TranslationProvider";
import { useAuth } from "@/providers/AuthProvider";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const t = useTranslation();
  const params = useParams();
  const { login, actionLoader } = useAuth();

  const locale = (params?.locale as string) || "en";

  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = methods;

  const handleLogin = (data: LoginFormData) => {
    login(data.email, data.password);
  };

  return (
    <div className="flex items-center justify-center my-12">
      <Card className="w-[375px] lg:w-[420px] drop-shadow-2xl">
        <CardHeader>
          <h2 className="text-3xl font-bold mt-1">{t("loginTitle")}</h2>
        </CardHeader>
        <CardContent className="mb-2">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="space-y-4">
                <FormInput
                  id="email"
                  name="email"
                  label={t("email")}
                  icon="mail"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="rounded-full"
                />

                <FormInput
                  id="password"
                  name="password"
                  label={t("password")}
                  type="password"
                  isPassword={true}
                  placeholder={t("passwordPlaceholder")}
                  className="rounded-full"
                />
              </div>

              <div className="mb-4 flex flex-row items-center justify-between mt-4">
                <div className="flex flex-row gap-2 items-center">
                  <Checkbox className="rounded-full my-2" />
                  <p>{t("rememberMe")}</p>
                </div>
                <div>
                  <Link href={`/${locale}/auth/forgot-password`}>
                    <p className="text-amber-400 hover:underline">
                      {t("forgotPassword")}
                    </p>
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-coffee-brown hover:bg-amber-400 text-white rounded-full"
                disabled={actionLoader}
              >
                {t("loginButton")}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
