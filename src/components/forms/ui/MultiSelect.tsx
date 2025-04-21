"use client";

import { useEffect, useRef, useState } from "react";
import ErrorMessage from "./ErrorMessage";

type Option = {
  value: string | number;
  label: string;
};

type MultiSelectProps = {
  id: string;
  name: string;
  label: string;
  options: Option[];
  selectedValues?: (string | number)[];
  hasError?: boolean;
  errors?: string[];
  placeholder?: string;
  onChange?: (selectedValues: (string | number)[]) => void;
};

export default function MultiSelect({
  id,
  name,
  label,
  options,
  selectedValues = [],
  hasError = false,
  errors,
  placeholder = "Sélectionner...",
  onChange,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<(string | number)[]>(selectedValues);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const errorId = hasError && errors ? `${id}-error` : undefined;

  useEffect(() => {
    // Mettre à jour la sélection si les valeurs externes changent
    setSelected(selectedValues);
  }, [selectedValues]);

  useEffect(() => {
    // Gérer les clics en dehors du dropdown pour le fermer
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (value: string | number) => {
    console.log("toggleOption");
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    setSelected(newSelected);

    if (onChange) {
      onChange(newSelected);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getSelectedLabels = () => {
    return options
      .filter((option) => selected.includes(option.value))
      .map((option) => option.label)
      .join(", ");
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>

      <div className="relative" ref={dropdownRef}>
        <div
          className={`w-full p-2 border rounded-md flex justify-between items-center cursor-pointer ${
            hasError ? "border-red-500" : ""
          }`}
          onClick={toggleDropdown}
        >
          <div className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
            {selected.length > 0 ? getSelectedLabels() : placeholder}
          </div>
          <div className="ml-2">
            <svg
              className={`h-4 w-4 transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
            {options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option.value}
                  className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                    selected.includes(option.value)
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }`}
                  onClick={() => toggleOption(option.value)}
                >
                  <input
                    type="checkbox"
                    id={`${id}-option-${option.value}`}
                    checked={selected.includes(option.value)}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  <span className="block w-full cursor-pointer">
                    {option.label}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">Aucune option disponible</div>
            )}
          </div>
        )}

        {/* Champ caché pour le formulaire */}
        <input
          type="hidden"
          name={name}
          id={id}
          value={selected.join(",")}
          aria-describedby={errorId}
        />
      </div>

      <ErrorMessage id={errorId} errors={errors} />
    </div>
  );
}
