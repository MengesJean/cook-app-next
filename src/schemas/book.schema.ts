import { z } from "zod";

export const BookFormSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis." }).trim(),
  description: z
    .string()
    .min(1, { message: "La description est requise." })
    .trim(),
});
