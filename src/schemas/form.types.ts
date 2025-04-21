import { BookType } from "@/types/Book.type";
import { RecipeType } from "@/types/Recipe.type";

// Types génériques pour les résultats d'action
export type ActionResult<T = undefined> =
  | { success: true; message: string; data?: T; errors?: never }
  | {
      success: false;
      message: string;
      errors: Record<string, string[]>;
      data?: never;
    };

// Types pour les formulaires de livre
export type BookFormValues = {
  title: string;
  description: string;
};

export type BookFormAction = ActionResult<BookType>;

// Types pour les formulaires de recette
export type RecipeFormValues = {
  title: string;
  description: string;
  bookIds?: number[];
  isPublic?: boolean;
};

export type RecipeFormAction = ActionResult<RecipeType>;

// Types pour le formulaire de connexion
export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginFormAction = ActionResult<{
  accessToken: string;
  refreshToken: string;
}>;

// Types pour le formulaire d'inscription
export type RegisterFormValues = {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterFormAction = ActionResult<void>;
