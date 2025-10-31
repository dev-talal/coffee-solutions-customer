import React from "react";
import { cn } from "@/lib/utils";

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  className,
  onChange,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={cn("border rounded-full p-3 w-full", className)}
    />
  );
};

export default Input;
