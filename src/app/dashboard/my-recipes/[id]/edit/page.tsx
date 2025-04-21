import { getRecipeById } from "@/actions/recipes.action";
import Container from "@/components/Container";
import RecipeForm from "@/components/forms/RecipeForm";
import Heading from "@/components/Heading";
import { redirect } from "next/navigation";

interface EditRecipePageProps {
  params: {
    id: string;
  };
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;
  const recipeData = await getRecipeById(id);

  // Si la recette n'existe pas ou en cas d'erreur, rediriger vers la liste des recettes
  if (recipeData.error) {
    redirect("/dashboard/my-recipes");
  }

  return (
    <Container>
      <Heading>Modifier la recette</Heading>
      <RecipeForm initialRecipe={recipeData} isEditing={true} />
    </Container>
  );
}
