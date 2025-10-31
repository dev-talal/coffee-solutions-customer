import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Controller, useFormContext } from "react-hook-form";

interface FormInputProps {
  name: string;
}

export const FormOTPInput: React.FC<FormInputProps> = (props) => {
  const { name } = props;

  const formContext = useFormContext();

  if (!formContext) {
    return (
      <div dir="ltr">
        <InputOTP maxLength={6} inputMode="numeric">
          <InputOTPGroup>
            <InputOTPSlot index={0} className="text-lg font-semibold" />
            <InputOTPSlot index={1} className="text-lg font-semibold " />
            <InputOTPSlot index={2} className="text-lg font-semibold" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="text-lg font-semibold" />
            <InputOTPSlot index={4} className=" text-lg font-semibold" />
            <InputOTPSlot index={5} className="text-lg font-semibold" />
          </InputOTPGroup>
        </InputOTP>
      </div>
    );
  }

  const {
    control,
    formState: { errors },
  } = formContext;

  const error = errors[name]?.message as string | undefined;

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div dir="ltr">
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputMode="numeric"
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="h-11 w-[47px] lg:w-[55px] text-lg font-semibold"
                />
                <InputOTPSlot
                  index={1}
                  className="h-11 w-[47px] lg:w-[55px] text-lg font-semibold"
                />
                <InputOTPSlot
                  index={2}
                  className="h-11 w-[47px] lg:w-[55px] text-lg font-semibold"
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  className="h-11 w-[47px] lg:w-[55px] text-lg font-semibold"
                />
                <InputOTPSlot
                  index={4}
                  className="h-11 w-[47px] lg:w-[55px] text-lg font-semibold"
                />
                <InputOTPSlot
                  index={5}
                  className="h-11 w-[47px] lg:w-[55px] text-lg font-semibold"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
        )}
      />
      {error && <span className="text-red-500 mt-2 block">{error}</span>}
    </>
  );
};
