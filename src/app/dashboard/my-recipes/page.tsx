"use client";

import { getMyRecipes } from "@/actions/recipes.action";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import RecipeCard from "@/components/RecipeCard";
import { RecipeType } from "@/types/Recipe.type";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getMyRecipes();
        console.log(data);
        if (data) {
          setRecipes(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des recettes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <div className="flex justify-between items-center mb-5">
        <Heading>Mes recettes</Heading>
        <Button
          href="/dashboard/my-recipes/create"
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
        >
          Créer une recette
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Chargement en cours...</p>
        </div>
      ) : recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {recipes.map((item: RecipeType) => (
            <Link href={`/dashboard/my-recipes/${item.id}`} key={item.id}>
              <RecipeCard recipe={item} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Vous n&apos;avez pas encore de recettes.
          </p>
          <Link
            href="/dashboard/create-recipe"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
          >
            Créer votre première recette
          </Link>
        </div>
      )}
    </Container>
  );
}
