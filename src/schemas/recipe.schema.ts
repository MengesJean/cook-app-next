import { z } from "zod";

export const IngredientFormSchema = z.object({
  ingredient_id: z.number().optional(),
  name: z.string().min(1, { message: "Le nom de l'ingrédient est requis." }),
  quantity: z
    .number({ invalid_type_error: "La quantité doit être un nombre." })
    .positive({ message: "La quantité doit être positive." }),
  unit: z.string().min(1, { message: "L'unité est requise." }),
  order: z.number().min(0),
});

export const StepFormSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Le contenu de l'étape est requis." })
    .trim(),
  order: z.number().min(0),
});

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
  recipeIngredients: z.array(IngredientFormSchema).optional(),
  steps: z.array(StepFormSchema).optional(),
});
