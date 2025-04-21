import { getMyBooks } from "@/actions/books.action";
import BookCard from "@/components/BookCard";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import { BookType } from "@/types/Book.type";

export default async function Page() {
  const books = await getMyBooks();
  console.log(books);

  return (
    <Container>
      <div className="flex justify-between items-center mb-5">
        <Heading>Mes livres</Heading>
        <Button
          href="/dashboard/my-books/create"
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
        >
          Créer un livre
        </Button>
      </div>

      {books.items && books.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {books.items.map((book: BookType) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Vous n&apos;avez pas encore de livres.
          </p>
        </div>
      )}
    </Container>
  );
}
