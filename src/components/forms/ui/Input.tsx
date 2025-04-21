"use client";

type InputProps = {
  id: string;
  name: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value?: string;
  hasError?: boolean;
  "aria-describedby"?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  id,
  name,
  type = "text",
  placeholder,
  value = "",
  hasError = false,
  "aria-describedby": ariaDescribedby,
  onChange,
}: InputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      className={`w-full p-2 border rounded-md ${
        hasError ? "border-red-500" : ""
      }`}
      value={value}
      onChange={onChange}
      aria-describedby={ariaDescribedby}
      placeholder={placeholder}
    />
  );
}
