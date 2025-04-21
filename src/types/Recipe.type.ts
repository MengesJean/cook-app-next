import { BookType } from "./Book.type";

export type RecipeType = {
  id?: number;
  title: string;
  description: string;
  Books: BookType[];
  createdAt: Date;
  updated: Date;
};
