"use client";

import ErrorMessage from "./ui/ErrorMessage";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";

type FormFieldProps = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "email" | "password";
  value?: string;
  errors?: string[];
  rows?: number;
  placeholder?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export function FormField({
  name,
  label,
  type = "text",
  value = "",
  errors,
  rows = 4,
  placeholder,
  onChange,
}: FormFieldProps) {
  const id = `field-${name}`;
  const hasError = errors && errors.length > 0;
  const errorId = hasError ? `${id}-error` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>

      {type === "textarea" ? (
        <Textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          hasError={hasError}
          aria-describedby={errorId}
          onChange={onChange}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          hasError={hasError}
          aria-describedby={errorId}
          onChange={onChange}
        />
      )}

      <ErrorMessage id={errorId} errors={errors} />
    </div>
  );
}

// Export named et default pour compatibilité
export { FormField as default };
