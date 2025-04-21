"use client";

import ErrorMessage from "./ErrorMessage";

type ToggleProps = {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  hasError?: boolean;
  errors?: string[];
  onChange?: (checked: boolean) => void;
};

export default function Toggle({
  id,
  label,
  checked,
  hasError = false,
  errors,
  onChange,
}: ToggleProps) {
  const errorId = hasError && errors ? `${id}-error` : undefined;

  const handleClick = () => {
    if (onChange) {
      onChange(!checked);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </label>
        <button
          type="button"
          onClick={handleClick}
          className="relative inline-block h-6 w-11 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
          aria-checked={checked}
          role="switch"
        >
          <span
            className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${
              checked ? "bg-blue-600" : "bg-gray-300"
            } ${hasError ? "ring-2 ring-red-500" : ""}`}
          ></span>
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          ></span>
        </button>
      </div>
      <ErrorMessage id={errorId} errors={errors} />
    </div>
  );
}
