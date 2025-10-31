"use client";

import { useEffect, useState } from "react";
import { FormInput } from "@/app/components/common/FormInput";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/TranslationProvider";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileSchemaType } from "@/lib/validations/auth";
import { useAuthCheck } from "@/hooks/auth-check";
import { DynamicIcon } from "lucide-react/dynamic";

const ProfileForm: React.FC = () => {
  const t = useTranslation();
  const { user, actionLoader: loading, updateProfile } = useAuthCheck();
  const [preview, setPreview] = useState<string | null>(null);

  const methods = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema(t)),
  });

  const { handleSubmit, watch, register, formState } = methods;

  const saveChanges = (data: ProfileSchemaType) => {
    updateProfile(data);
  };
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (
        name === "profile" &&
        value.profile instanceof FileList &&
        value.profile.length > 0
      ) {
        setPreview(URL.createObjectURL(value.profile[0]));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (user) {
      methods.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone ?? "",
        profile: user.profile ?? "",
      });
      if (user.profile) {
        setPreview(user.profile);
      }
    }
  }, [user, methods]);

  return (
    <div className="flex flex-col my-8 px-8">
      <div className="flex items-center gap-4 mb-8 w-full">
        <div className="relative w-24 h-24">
          <Image
            src={preview ?? "/p1.jpg"}
            alt="Profile"
            fill
            className="rounded-full object-cover border-2 border-gray-300"
          />
          <label
            htmlFor="profile"
            className="absolute bottom-0 right-0 z-10 cursor-pointer bg-card rounded-full p-2 shadow-md"
          >
            <DynamicIcon name="pencil" className="w-5 h-5" />
            <input
              id="profile"
              type="file"
              className="hidden"
              {...register("profile")}
              accept="image/*"
            />
          </label>
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            {user?.first_name || "John"} {user?.last_name || "Doe"}
          </h3>
          <p className="text-foreground">
            {user?.email || "john.doe@example.com"}
          </p>
        </div>
      </div>
      {formState.errors["profile"]?.message && (
        <span className="text-red-500 text-sm">
          {formState.errors["profile"]?.message as string | undefined}
        </span>
      )}
      <h2 className="text-2xl font-bold mb-4 text-foreground">
        {t("profileDetails")}
      </h2>

      <div className="py-10 w-full flex items-start">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(saveChanges)}
            className="space-y-4 w-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormInput
                  id="firstName"
                  name="first_name"
                  label={t("firstName")}
                  type="text"
                  placeholder={t("firstNamePlaceholder")}
                  className="rounded-full"
                />
              </div>

              <div className="space-y-4">
                <FormInput
                  id="lastName"
                  name="last_name"
                  label={t("lastName")}
                  type="text"
                  placeholder={t("lastNamePlaceholder")}
                  className="rounded-full"
                />
              </div>

              <div className="space-y-4">
                <FormInput
                  id="email"
                  name="email"
                  label={t("email")}
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="rounded-full"
                  readOnly
                />
              </div>

              <div className="space-y-4">
                <FormInput
                  id="phone"
                  name="phone"
                  label={t("phoneNumber")}
                  type="telephone"
                  placeholder={t("phoneNumberPlaceholder")}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={loading}
                className="bg-coffee-brown hover:bg-amber-400 text-white rounded-full"
              >
                {loading && (
                  <DynamicIcon name="loader" className="w-6 h-6 animate-spin" />
                )}
                {t("saveChanges")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ProfileForm;
