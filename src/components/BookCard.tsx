import { BookType } from "@/types/Book.type";
import Link from "next/link";

type BookCardProps = {
  book: BookType;
};

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link href={`/dashboard/my-books/${book.id}`} className="block">
      <div className="shadow bg-background px-6 py-4 rounded-md hover:shadow-md transition-shadow">
        <h2 className="text-xl font-bold mb-2">{book.title}</h2>
        <p className="mb-4 line-clamp-2">{book.description}</p>
        <div className="flex justify-between items-center">
          <time
            dateTime={book.createdAt.toString()}
            className="text-sm text-gray-500"
          >
            {new Date(book.createdAt).toLocaleDateString("fr-FR")}
          </time>
          {book.recipes && (
            <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {book.recipes.length} recette
              {book.recipes.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
