"use client";

import { login } from "@/actions/auth.action";
import { FormField } from "@/components/forms/FormField";
import { useForm } from "@/hooks/useForm";
import { LoginFormValues } from "@/schemas/form.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const defaultValues: LoginFormValues = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const router = useRouter();
  const { state, handleChange, setSubmitting, setErrors, getFormData } =
    useForm<LoginFormValues>(defaultValues);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = getFormData();
    const result = await login(formData);

    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard");
      router.refresh();
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

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link href="/register" className="text-blue-600 hover:text-blue-500">
            Pas encore de compte ?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={state.isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-md transition-colors"
      >
        {state.isSubmitting ? "Connexion en cours..." : "Se connecter"}
      </button>
    </form>
  );
}
