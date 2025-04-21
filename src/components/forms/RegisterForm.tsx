"use client";

import { register } from "@/actions/auth.action";
import { FormField } from "@/components/forms/FormField";
import { useForm } from "@/hooks/useForm";
import { RegisterFormValues } from "@/schemas/form.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const defaultValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const { state, handleChange, setSubmitting, setErrors, getFormData } =
    useForm<RegisterFormValues>(defaultValues);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = getFormData();
    const result = await register(formData);

    if (result.success) {
      toast.success(result.message);
      router.push("/login");
    } else {
      setErrors(result.errors || {}, result.message);
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      {state.message && (
        <div className="p-3 bg-red-50 text-red-500 rounded-md">
          {state.message}
        </div>
      )}

      <FormField
        name="name"
        label="Nom"
        type="text"
        placeholder="Votre nom"
        value={state.values.name}
        errors={state.errors.name}
        onChange={handleChange}
      />

      <FormField
        name="email"
        label="Email"
        type="email"
        placeholder="votre-email@exemple.com"
        value={state.values.email}
        errors={state.errors.email}
        onChange={handleChange}
      />

      <FormField
        name="password"
        label="Mot de passe"
        type="password"
        placeholder="********"
        value={state.values.password}
        errors={state.errors.password}
        onChange={handleChange}
      />

      <FormField
        name="confirmPassword"
        label="Confirmer le mot de passe"
        type="password"
        placeholder="********"
        value={state.values.confirmPassword}
        errors={state.errors.confirmPassword}
        onChange={handleChange}
      />

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            Déjà un compte ?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={state.isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-md transition-colors"
      >
        {state.isSubmitting ? "Inscription en cours..." : "S'inscrire"}
      </button>
    </form>
  );
}
