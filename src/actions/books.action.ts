"use server";

import { BookFormSchema } from "@/schemas/book.schema";
import { BookFormAction } from "@/schemas/form.types";
import { getAccessToken } from "../utils/auth/session.actions";

export const getPublicBooks = async () => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/public`);
    return await data.json();
  } catch (error) {
    console.error("Error fetching public books:", error);
    return { items: [], total: 0, page: 1, limit: 10, pages: 1 };
  }
};

export const getMyBooks = async () => {
  try {
    const accessToken = await getAccessToken();

    // Si pas de token, l'utilisateur n'est pas connecté
    if (!accessToken) {
      return { user: null };
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      return { books: null };
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching user books:", error);
    return { books: null };
  }
};

export const getBookById = async (id: string) => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return { error: "Vous devez être connecté pour accéder à ce livre" };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/book/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return { error: "Impossible de récupérer le livre" };
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching book:", error);
    return {
      error: "Une erreur est survenue lors de la récupération du livre",
    };
  }
};

export const getPublicBookById = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/book/${id}/public`
    );

    if (!response.ok) {
      return { error: "Impossible de récupérer le livre" };
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching book:", error);
    return {
      error: "Une erreur est survenue lors de la récupération du livre",
    };
  }
};

export const createBook = async (
  formData: FormData
): Promise<BookFormAction> => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        message: "Vous devez être connecté pour créer un livre",
        errors: {},
      };
    }

    const validatedFields = BookFormSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      isPublic: formData.get("isPublic"),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Champs invalides. Échec de la création du livre.",
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Échec de la création du livre",
        errors: {},
      };
    }

    // Récupérer l'objet créé avec son ID
    const createdBook = await response.json();
    return {
      success: true,
      message: "Livre créé avec succès",
      data: createdBook,
    };
  } catch (error) {
    console.error("Error creating book:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la création du livre",
      errors: {},
    };
  }
};

export const updateBook = async (
  id: string,
  formData: FormData
): Promise<BookFormAction> => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        message: "Vous devez être connecté pour modifier un livre",
        errors: {},
      };
    }

    const validatedFields = BookFormSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      isPublic: formData.get("isPublic"),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Champs invalides. Échec de la modification du livre.",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/book/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(validatedFields.data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Échec de la modification du livre",
        errors: {},
      };
    }

    // Pour la cohérence, récupérons aussi les données mises à jour
    const updatedBook = await response.json();
    return {
      success: true,
      message: "Livre modifié avec succès",
      data: updatedBook,
    };
  } catch (error) {
    console.error("Error updating book:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la modification du livre",
      errors: {},
    };
  }
};
