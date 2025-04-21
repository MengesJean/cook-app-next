"use server";
import { LoginFormSchema, RegisterFormSchema } from "@/schemas/auth.schema";
import { LoginFormAction, RegisterFormAction } from "@/schemas/form.types";
import { deleteSession, setSession } from "@/utils/auth/session.actions";
import { redirect } from "next/navigation";

// Fonction pour rediriger vers la page de connexion après l'inscription
export async function redirectToLogin() {
  redirect("/login");
}

// Fonction pour rediriger vers le tableau de bord après la connexion
export async function redirectToDashboard() {
  redirect("/dashboard");
}

export const register = async (
  formData: FormData
): Promise<RegisterFormAction> => {
  try {
    // Extract form data
    const rawValues = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      name: formData.get("name") as string,
    };

    // Validate form input
    const validatedFields = RegisterFormSchema.safeParse(rawValues);
    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Veuillez corriger les erreurs dans le formulaire.",
      };
    }

    const { name, email, password } = validatedFields.data;

    // Send registration request
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, email }),
      }
    );

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message:
          errorData?.message || "L'inscription a échoué. Veuillez réessayer.",
        errors: {},
      };
    }

    return {
      success: true,
      message: "Inscription réussie ! Redirection vers la page de connexion...",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      errors: {},
    };
  }
};

export const login = async (formData: FormData): Promise<LoginFormAction> => {
  try {
    // Extract form data
    const rawValues = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate form input
    const validatedFields = LoginFormSchema.safeParse(rawValues);
    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Veuillez corriger les erreurs dans le formulaire.",
      };
    }

    const { email, password } = validatedFields.data;

    // Send login request
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, email }),
      }
    );

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message:
          errorData?.message || "La connexion a échoué. Veuillez réessayer.",
        errors: {},
      };
    }

    const data = await response.json();
    // Store both tokens in cookies
    await setSession(data.accessToken, data.refreshToken);

    return {
      success: true,
      message: "Connexion réussie ! Redirection vers le tableau de bord...",
      data: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      errors: {},
    };
  }
};

export const logout = async () => {
  await deleteSession();
  redirect("/login");
};
