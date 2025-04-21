import { z } from "zod";

export const RegisterFormSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Veuillez entrer un email valide." })
      .trim(),
    password: z
      .string()
      .min(2, {
        message: "Le mot de passe doit contenir au moins 2 caractères.",
      })
      .trim(),
    confirmPassword: z.string(),
    name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe doivent correspondre.",
    path: ["confirmPassword"],
  });

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer un email valide." })
    .trim(),
  password: z.string().trim(),
});
