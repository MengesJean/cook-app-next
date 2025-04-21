import { BookType } from "./Book.type";

export type RecipeType = {
  id?: number;
  title: string;
  description: string;
  isPublic: boolean;
  books: BookType[];
  createdAt: Date;
  updated: Date;
};
