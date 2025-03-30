import { RecipeType } from "../../types/Recipe.type";

type RecipeCardProps = {
  recipe: RecipeType;
};

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <div className="shadow bg-background px-6 py-4 rounded-md">
      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
      <p className="mb-4">{recipe.description}</p>
      <time dateTime={recipe.createdAt.toString()} className="font-bold">
        {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
      </time>
    </div>
  );
};

export default RecipeCard;
