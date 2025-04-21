import { RecipeType } from "./Recipe.type";

export type BookType = {
  id?: number;
  title: string;
  description: string;
  recipes?: RecipeType[];
  createdAt: Date;
  updated: Date;
  isPublic: boolean;
};

export type BooksResponseType = {
  items: BookType[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};
