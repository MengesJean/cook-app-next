import { getBookById } from "@/actions/books.action";
import Container from "@/components/Container";
import BookForm from "@/components/forms/BookForm";
import Heading from "@/components/Heading";
import { redirect } from "next/navigation";

interface EditBookPageProps {
  params: {
    id: string;
  };
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;
  const bookData = await getBookById(id);

  // Si le livre n'existe pas ou en cas d'erreur, rediriger vers la liste des livres
  if (bookData.error) {
    redirect("/dashboard/books");
  }

  return (
    <Container>
      <Heading>Modifier le livre</Heading>
      <BookForm initialBook={bookData} isEditing={true} />
    </Container>
  );
}
