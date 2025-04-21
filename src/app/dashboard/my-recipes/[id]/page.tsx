import { getRecipeById } from "@/actions/recipes.action";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import { BookType } from "@/types/Book.type";
import { IngredientRecipeType } from "@/types/Ingredient.type";
import { StepType } from "@/types/Step.type";
import { notFound } from "next/navigation";

export default async function RecipeDetailsPage({
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
      <div className="flex justify-between items-center mb-5">
        <Heading>{recipe.title}</Heading>
        <div className="flex space-x-4">
          <Button href={`/dashboard/my-recipes/${recipe.id}/edit`}>
            Modifier
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {recipe.isPublic ? "Public" : "Privé"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {recipe.description}
            </p>
          </div>

          {recipe.recipeIngredients && recipe.recipeIngredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Ingrédients</h3>
              <ul className="list-disc pl-5 space-y-1">
                {recipe.recipeIngredients.map(
                  (item: IngredientRecipeType, index: number) => (
                    <li key={index}>
                      {item.quantity} {item.unit} {item.ingredient?.name}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {recipe.steps && recipe.steps.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Étapes</h3>
              <ol className="list-decimal pl-5 space-y-2">
                {recipe.steps
                  .sort((a: StepType, b: StepType) => a.order - b.order)
                  .map((step: StepType, index: number) => (
                    <li key={index} className="pl-2">
                      {step.content}
                    </li>
                  ))}
              </ol>
            </div>
          )}

          {recipe.books && recipe.books.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Livres</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.books.map((book: BookType) => (
                  <Button key={book.id} href={`/dashboard/my-books/${book.id}`}>
                    {book.title}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
