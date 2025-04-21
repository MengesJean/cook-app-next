import { IngredientRecipeType } from "@/types/Ingredient.type";
import { RecipeType } from "@/types/Recipe.type";
import { StepType } from "@/types/Step.type";

type RecipeDetailProps = {
  recipe: RecipeType;
};

const RecipeDetail = ({ recipe }: RecipeDetailProps) => {
  return (
    <div className="mt-6 space-y-10">
      {/* Section des ingrédients */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Ingrédients</h2>
        {recipe.recipeIngredients && recipe.recipeIngredients.length > 0 ? (
          <ul className="space-y-2">
            {recipe.recipeIngredients
              .sort((a, b) => a.order - b.order)
              .map((ingredient: IngredientRecipeType) => (
                <li key={ingredient.id} className="flex items-center">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="font-medium">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                  <span className="ml-2">
                    {ingredient.ingredient?.name || "Ingrédient sans nom"}
                  </span>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">
            Aucun ingrédient listé pour cette recette.
          </p>
        )}
      </div>

      {/* Section des étapes */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Étapes de préparation</h2>
        {recipe.steps && recipe.steps.length > 0 ? (
          <ol className="space-y-4">
            {recipe.steps
              .sort((a, b) => a.order - b.order)
              .map((step: StepType) => (
                <li
                  key={step.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                >
                  <div className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      {step.order + 1}
                    </span>
                    <p className="whitespace-pre-wrap">{step.content}</p>
                  </div>
                </li>
              ))}
          </ol>
        ) : (
          <p className="text-gray-500 italic">
            Aucune étape listée pour cette recette.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
