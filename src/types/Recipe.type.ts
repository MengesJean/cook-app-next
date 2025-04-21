import { BookType } from "./Book.type";
import { IngredientRecipeType } from "./Ingredient.type";
import { StepType } from "./Step.type";

export type RecipeType = {
  id?: number;
  title: string;
  description: string;
  isPublic: boolean;
  books: BookType[];
  recipeIngredients?: IngredientRecipeType[];
  steps?: StepType[];
  createdAt: Date;
  updated: Date;
};
