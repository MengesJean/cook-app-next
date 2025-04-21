import { getBookById } from "@/actions/books.action";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import RecipeCard from "@/components/RecipeCard";
import { RecipeType } from "@/types/Recipe.type";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Fragment } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function BookPage({ params }: PageProps) {
  const { id } = await params;
  const bookData = await getBookById(id);

  if (bookData.error) {
    // Rediriger vers la page des livres en cas d'erreur
    redirect("/dashboard/my-books");
  }

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Heading>{bookData.title}</Heading>
          <div className="flex gap-2">
            <Link href={`/dashboard/my-books/${id}/edit`}>
              <Button variant="primary">Modifier</Button>
            </Link>
            <Link href="/dashboard/my-books">
              <Button variant="secondary">Retour</Button>
            </Link>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {bookData.description}
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>
            Créé le {new Date(bookData.createdAt).toLocaleDateString("fr-FR")}
          </p>
          <p>
            Mis à jour le{" "}
            {new Date(bookData.updatedAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Recettes dans ce livre</h2>
          {/* Ici, on pourrait ajouter un bouton pour ajouter une recette au livre */}
        </div>

        {bookData.recipes?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {bookData.recipes?.map((recipe: RecipeType) => (
              <Fragment key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Aucune recette dans ce livre
            </p>
            <Link href="/dashboard/recipes">
              <Button>Ajouter des recettes</Button>
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
