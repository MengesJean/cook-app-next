import { RecipeType } from "@/types/Recipe.type";

type RecipeCardProps = {
  recipe: RecipeType;
};

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <div className="shadow bg-background px-6 py-4 rounded-md hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
      <p className="mb-4 line-clamp-2">{recipe.description}</p>
      <div className="flex justify-between items-center">
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
