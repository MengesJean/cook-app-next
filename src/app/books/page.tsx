import { getPublicBooks } from "@/actions/books.action";
import BookCard from "@/components/BookCard";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import { BookType, BooksResponseType } from "@/types/Book.type";
import Link from "next/link";

const Page = async () => {
  const books: BooksResponseType | null = await getPublicBooks();
  console.log(books);

  return (
    <Container>
      <div className="flex justify-between items-center mb-5">
        <Heading>Livres publics</Heading>
      </div>

      {books && books.items && books.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {books.items.map((item: BookType) => (
            <Link href={`/books/${item.id}`} key={item.id}>
              <BookCard book={item} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Il n&apos;y a aucun livre.
          </p>
        </div>
      )}
    </Container>
  );
};

export default Page;
