import { getRecipeById } from "@/actions/recipes.action";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import RecipeForm from "@/components/forms/RecipeForm";
import { notFound } from "next/navigation";

export default async function EditRecipePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    return notFound();
  }

  return (
    <Container>
      <div className="mb-6">
        <Heading>Modifier la recette</Heading>
        <p className="text-gray-600 dark:text-gray-400">
          Modifiez les détails de votre recette
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <RecipeForm initialRecipe={recipe} isEditing={true} />
      </div>
    </Container>
  );
}
