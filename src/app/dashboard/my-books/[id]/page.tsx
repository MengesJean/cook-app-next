import { getBookById } from "@/actions/books.action";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import RecipeCard from "@/components/RecipeCard";
import { RecipeType } from "@/types/Recipe.type";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BookDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return notFound();
  }

  return (
    <Container>
      <div className="flex justify-between items-center mb-5">
        <Heading>{book.title}</Heading>
        <div className="flex space-x-4">
          <Button
            href={`/dashboard/my-books/${book.id}/edit`}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
          >
            Modifier
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-10">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {book.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Recettes</h2>
        </div>

        {book.recipes && book.recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {book.recipes.map((recipe: RecipeType) => (
              <Link href={`/dashboard/my-recipes/${recipe.id}`} key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ce livre ne contient pas encore de recettes.
            </p>
            <Button
              href="/dashboard/my-recipes"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
            >
              Ajouter des recettes au livre
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
