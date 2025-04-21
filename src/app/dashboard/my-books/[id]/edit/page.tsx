import { getBookById } from "@/actions/books.action";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import BookForm from "@/components/forms/BookForm";
import { notFound } from "next/navigation";

export default async function EditBookPage({
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
      <div className="mb-6">
        <Heading>Modifier le livre</Heading>
        <p className="text-gray-600 dark:text-gray-400">
          Modifiez les détails de votre livre de recettes
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <BookForm initialBook={book} isEditing={true} />
      </div>
    </Container>
  );
}
