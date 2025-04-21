import { getPublicRecipes } from "@/actions/recipes.action";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import RecipeCard from "@/components/RecipeCard";
import { RecipeType } from "@/types/Recipe.type";
import Link from "next/link";

const Page = async () => {
  const recipes: RecipeType[] | null = await getPublicRecipes();
  return (
    <Container>
      <div className="flex justify-between items-center mb-5">
        <Heading>Recettes publiques</Heading>
      </div>

      {recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {recipes.map((item: RecipeType) => (
            <Link href={`/recipes/${item.id}`} key={item.id}>
              <RecipeCard recipe={item} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Il n&apos;y a aucun recette.
          </p>
        </div>
      )}
    </Container>
  );
};

export default Page;
