import { z } from "zod";

export const RegisterFormSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(2, { message: "Password must be at least 2 characters long." })
      .trim(),
    confirmPassword: z.string(),
    name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export type RegisterFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      values?: {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      };
      message?: string;
    }
  | undefined;

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().trim(),
});

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  values?: {
    email?: string;
    password?: string;
  };
  message?: string;
};
