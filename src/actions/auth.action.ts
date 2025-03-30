"use server";
import {
  LoginFormSchema,
  RegisterFormSchema,
  RegisterFormState,
} from "@/schemas/auth.schema";
import { deleteSession, setSession } from "@/utils/auth/session.actions";
import console from "console";
import { redirect } from "next/navigation";

export const register = async (
  state: RegisterFormState,
  formData: FormData
) => {
  // Extract values outside try block to make them available in catch
  const rawValues = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    name: formData.get("name") as string,
  };

  try {
    // Validate form input
    const validatedFields = RegisterFormSchema.safeParse(rawValues);
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        values: rawValues,
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
      return {
        message: "Registration failed. Please try again.",
        values: rawValues,
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
      values: rawValues,
    };
  }

  redirect("/login");
};

export const login = async (state: RegisterFormState, formData: FormData) => {
  // Extract values outside try block to make them available in catch
  const rawValues = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    // Validate form input
    const validatedFields = LoginFormSchema.safeParse(rawValues);
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        values: rawValues,
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
      return {
        message: "Login failed. Please try again.",
        values: rawValues,
      };
    }

    const data = await response.json();
    // Store both tokens in cookies
    await setSession(data.accessToken, data.refreshToken);
  } catch (error) {
    console.error("Login error:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
      values: rawValues,
    };
  }

  // Utiliser une redirection avec un paramètre timestamp pour forcer le rafraîchissement
  redirect(`/dashboard?t=${Date.now()}`);
};

export const logout = async () => {
  await deleteSession();
  redirect("/login");
};
