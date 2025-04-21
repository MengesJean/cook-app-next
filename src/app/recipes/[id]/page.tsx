import { getPublicRecipeById } from "@/actions/recipes.action";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import { BookType } from "@/types/Book.type";
import { getCurrentUser } from "@/utils/auth/session.actions";
import Link from "next/link";
import { redirect } from "next/navigation";

interface RecipePageProps {
  params: {
    id: string;
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const recipeData = await getPublicRecipeById(id);
  const session = await getCurrentUser();

  if (recipeData.error) {
    // Rediriger vers la page des recettes en cas d'erreur
    redirect("/recipes");
  }
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Heading>{recipeData.title}</Heading>
          <div className="flex gap-2">
            {recipeData.user.id === session.user?.id && (
              <Link href={`/dashboard/my-recipes/${id}/edit`}>
                <Button variant="primary">Modifier</Button>
              </Link>
            )}
            <Link href="/dashboard/my-recipes">
              <Button variant="secondary">Retour</Button>
            </Link>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {recipeData.description}
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Créé le {new Date(recipeData.createdAt).toLocaleDateString()}</p>
          <p>
            Mis à jour le {new Date(recipeData.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {recipeData.Books?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Livres contenant cette recette
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {recipeData.Books.map((book: BookType) => (
              <Link
                key={book.id}
                href={`/dashboard/books/${book.id}`}
                className="block p-4 rounded-md shadow bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {book.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
