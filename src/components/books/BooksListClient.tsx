"use client";

import { useContentFilter } from "@/hooks/useContentFilter";
import { BookType } from "@/types/Book.type";
import Link from "next/link";
import BookCard from "../BookCard";

// Composant client pour le filtrage
const BooksListClient = ({ initialBooks }: { initialBooks: BookType[] }) => {
  // Utiliser notre hook personnalisé pour filtrer les livres
  const { filteredItems: books, isFiltered } = useContentFilter(initialBooks);

  if (books.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-medium mb-2">
          {isFiltered
            ? "Vous n'avez pas encore créé de livres."
            : "Aucun livre disponible pour le moment."}
        </p>
        <Link
          href="/dashboard/create-book"
          className="text-primary hover:underline mt-2 inline-block"
        >
          Créer votre premier livre
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book: BookType) => (
        <Link href={`/books/${book.id}`} key={book.id}>
          <BookCard book={book} />
        </Link>
      ))}
    </div>
  );
};

export default BooksListClient;
