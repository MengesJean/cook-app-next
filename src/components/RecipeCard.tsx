import { RecipeType } from "@/types/Recipe.type";

type RecipeCardProps = {
  recipe: RecipeType;
};

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  // Compter le nombre d'ingrédients et d'étapes
  const ingredientsCount = recipe.recipeIngredients?.length || 0;
  const stepsCount = recipe.steps?.length || 0;

  return (
    <div className="shadow bg-background px-6 py-4 rounded-md hover:shadow-md transition-shadow h-full flex flex-col">
      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
      <p className="mb-4 line-clamp-2">{recipe.description}</p>

      {/* Information sur les ingrédients et étapes */}
      <div className="flex space-x-3 mb-3 text-sm">
        {ingredientsCount > 0 && (
          <div className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-md">
            <span className="text-blue-800 dark:text-blue-200">
              {ingredientsCount} ingrédient{ingredientsCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
        {stepsCount > 0 && (
          <div className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-md">
            <span className="text-green-800 dark:text-green-200">
              {stepsCount} étape{stepsCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto">
        <time
          dateTime={recipe.createdAt.toString()}
          className="text-sm text-gray-500"
        >
          {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
        </time>
        {recipe.books && (
          <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {recipe.books.length} livre{recipe.books.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
