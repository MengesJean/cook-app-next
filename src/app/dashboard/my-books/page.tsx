import { getMyBooks } from "@/actions/books.action";
import BookCard from "@/components/BookCard";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import { BooksResponseType, BookType } from "@/types/Book.type";
import Link from "next/link";
import { Fragment } from "react";

const Page = async () => {
  const books: BooksResponseType | null = await getMyBooks();
  return (
    <Container>
      <div className="flex justify-between items-center mb-5">
        <Heading>Mes livres</Heading>
        <Link href="/dashboard/books/create">
          <Button>Créer un livre</Button>
        </Link>
      </div>
      {books?.items && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {books.items.map((book: BookType) => (
            <Fragment key={book.id}>
              <BookCard book={book} />
            </Fragment>
          ))}
        </div>
      )}
      {!books?.items.length && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Vous n&apos;avez pas encore de livres
          </p>
          <Link href="/dashboard/books/create">
            <Button>Créer votre premier livre</Button>
          </Link>
        </div>
      )}
    </Container>
  );
};

export default Page;
