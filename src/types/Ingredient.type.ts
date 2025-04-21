export type IngredientRecipeType = {
  id?: number;
  ingredient_id?: number;
  ingredient: IngredientType;
  quantity: number;
  unit: string;
  order: number;
};

export type IngredientFormType = {
  id?: number;
  ingredient_id?: number;
  name: string;
  quantity: number;
  unit: string;
  order: number;
};
export type IngredientType = {
  id?: number;
  name: string;
};

export type IngredientSelectOptionType = {
  value: number;
  label: string;
};
