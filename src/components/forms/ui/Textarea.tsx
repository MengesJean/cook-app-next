"use client";

type TextareaProps = {
  id: string;
  name: string;
  rows?: number;
  placeholder?: string;
  value?: string;
  hasError?: boolean;
  "aria-describedby"?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function Textarea({
  id,
  name,
  rows = 4,
  placeholder,
  value = "",
  hasError = false,
  "aria-describedby": ariaDescribedby,
  onChange,
}: TextareaProps) {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
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
