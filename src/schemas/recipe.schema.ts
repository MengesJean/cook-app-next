import { z } from "zod";

export const RecipeFormSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis." }).trim(),
  description: z
    .string()
    .min(1, { message: "La description est requise." })
    .trim(),
  bookIds: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(",").map(Number).filter(Boolean) : []
    ),
  isPublic: z
    .any()
    .optional()
    .transform((val) => val === "true" || val === true),
});
