"use client";

import { useState } from "react";

type FormErrors = Record<string, string[]>;

export interface FormState<T> {
  values: T;
  errors: FormErrors;
  message: string | null;
  isSubmitting: boolean;
}

/**
 * Hook personnalisé pour gérer l'état des formulaires
 * @param initialValues Valeurs initiales du formulaire
 * @returns État du formulaire et fonctions utilitaires
 */
export function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    message: null,
    isSubmitting: false,
  });

  /**
   * Met à jour une valeur du formulaire
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [name]: value },
    }));
  };

  /**
   * Commence la soumission du formulaire
   */
  const setSubmitting = (isSubmitting: boolean) => {
    setState((prev) => ({ ...prev, isSubmitting }));
  };

  /**
   * Met à jour les erreurs du formulaire
   */
  const setErrors = (errors: FormErrors, message?: string) => {
    setState((prev) => ({
      ...prev,
      errors,
      message: message || null,
      isSubmitting: false,
    }));
  };

  /**
   * Réinitialise le formulaire avec de nouvelles valeurs
   */
  const resetForm = (newValues?: Partial<T>) => {
    setState({
      values: newValues ? { ...initialValues, ...newValues } : initialValues,
      errors: {},
      message: null,
      isSubmitting: false,
    });
  };

  /**
   * Crée un objet FormData à partir des valeurs actuelles
   */
  const getFormData = (): FormData => {
    const formData = new FormData();

    Object.entries(state.values).forEach(([key, value]) => {
      if (value !== undefined) {
        // Gérer spécifiquement les booléens pour qu'ils soient correctement convertis
        if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false");
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return formData;
  };

  return {
    state,
    handleChange,
    setSubmitting,
    setErrors,
    resetForm,
    getFormData,
  };
}
