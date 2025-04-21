"use client";

import { useContentFilter } from "@/hooks/useContentFilter";
import { RecipeType } from "@/types/Recipe.type";
import Link from "next/link";
import RecipeCard from "../RecipeCard";

// Composant client pour le filtrage
const RecipesListClient = ({
  initialRecipes,
}: {
  initialRecipes: RecipeType[];
}) => {
  // Utiliser notre hook personnalisé pour filtrer les recettes
  const { filteredItems: recipes, isFiltered } =
    useContentFilter(initialRecipes);

  if (recipes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-medium mb-2">
          {isFiltered
            ? "Vous n'avez pas encore créé de recettes."
            : "Aucune recette disponible pour le moment."}
        </p>
        <Link
          href="/dashboard/create-recipe"
          className="text-primary hover:underline mt-2 inline-block"
        >
          Créer votre première recette
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe: RecipeType) => (
        <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
          <RecipeCard recipe={recipe} />
        </Link>
      ))}
    </div>
  );
};

export default RecipesListClient;
