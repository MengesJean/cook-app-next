import { getPublicBookById } from "@/actions/books.action";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import RecipeCard from "@/components/RecipeCard";
import { RecipeType } from "@/types/Recipe.type";
import { getCurrentUser } from "@/utils/auth/session.actions";
import Link from "next/link";
import { redirect } from "next/navigation";

interface RecipePageProps {
  params: {
    id: string;
  };
}

export default async function BookPage({ params }: RecipePageProps) {
  const { id } = await params;
  const bookData = await getPublicBookById(id);
  const session = await getCurrentUser();

  if (bookData.error) {
    // Rediriger vers la page des recettes en cas d'erreur
    redirect("/books");
  }

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Heading>{bookData.title}</Heading>
          <div className="flex gap-2">
            {bookData.user?.id === session.user?.id && (
              <Link href={`/dashboard/my-recipes/${id}/edit`}>
                <Button variant="primary">Modifier</Button>
              </Link>
            )}
            <Link href="/recipes">
              <Button variant="secondary">Retour</Button>
            </Link>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {bookData.description}
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Créé le {new Date(bookData.createdAt).toLocaleDateString()}</p>
          <p>
            Mis à jour le {new Date(bookData.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {bookData.recipes?.length > 0 && (
        <div className="mb-6 mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            Livres contenant cette recette
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {bookData.recipes.map((recipe: RecipeType) => (
              <Link key={recipe.id} href={`/dashboard/books/${recipe.id}`}>
                <RecipeCard recipe={recipe} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
