import Container from "@/components/Container";
import BookForm from "@/components/forms/BookForm";
import Heading from "@/components/Heading";

export default function CreateBookPage() {
  return (
    <Container>
      <Heading>Créer un livre</Heading>
      <BookForm />
    </Container>
  );
}
