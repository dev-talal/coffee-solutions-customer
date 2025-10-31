import * as z from "zod";

export const emailSchema = (t: { (key: string): string }) =>
  z.object({
    email: z.email({ message: t("email_required") }),
  });

export const forgotPasswordSchema = (t: { (key: string): string }) =>
  z
    .object({
      email: z.email({ message: t("email_required") }),
      otp: z
        .string({ message: t("otp_required") })
        .min(6, { message: t("otp_min") }),

      password: z.string().min(8, { message: t("password_required") }),
      password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("password_mismatch"),
      path: ["password_confirmation"],
    });

export const resetPasswordSchema = (t: { (key: string): string }) =>
  z
    .object({
      old_password: z.string().min(8, { message: t("password_required") }),
      new_password: z.string().min(8, { message: t("new_password_required") }),
      new_password_confirmation: z.string({
        message: t("confirm_password_required"),
      }),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
      message: t("password_mismatch"),
      path: ["new_password_confirmation"],
    });

export const profileSchema = (t: { (key: string): string }) =>
  z.object({
    first_name: z.string().min(1, { message: t("first_name_required") }),
    last_name: z.string().min(1, { message: t("last_name_required") }),
    email: z.email({ message: t("email_required") }),
    phone: z.string().min(6, { message: t("phone_required") }),
    profile: z.any().refine((val): val is FileList | string => {
      if (typeof val === "string") return true;
      if (val instanceof FileList) {
        return (
          val.length > 0 &&
          Array.from(val).every((file) => file.type.startsWith("image/"))
        );
      }
      return false;
    }, t("profile_image_required")),
  });

export type ProfileSchemaType = z.infer<ReturnType<typeof profileSchema>>;
export type EmailValues = z.infer<ReturnType<typeof emailSchema>>;
export type ForgotPasswordValues = z.infer<
  ReturnType<typeof forgotPasswordSchema>
>;
export type ResetPasswordValues = z.infer<
  ReturnType<typeof resetPasswordSchema>
>;
