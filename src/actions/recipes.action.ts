"use server";

import { RecipeFormAction } from "@/schemas/form.types";
import { RecipeFormSchema } from "@/schemas/recipe.schema";
import { getAccessToken } from "../utils/auth/session.actions";

export const getPublicRecipes = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe/public`);
  return await data.json();
};

export const getMyRecipes = async () => {
  try {
    const accessToken = await getAccessToken();

    // Si pas de token, l'utilisateur n'est pas connecté
    if (!accessToken) {
      return { user: null };
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      return { recipes: null };
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    return { recipes: null };
  }
};

export const getRecipeById = async (id: string) => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return { error: "Vous devez être connecté pour accéder à cette recette" };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/recipe/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return { error: "Impossible de récupérer la recette" };
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return {
      error: "Une erreur est survenue lors de la récupération de la recette",
    };
  }
};

export const getPublicRecipeById = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/recipe/${id}/public`
    );

    if (!response.ok) {
      return { error: "Impossible de récupérer la recette" };
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return {
      error: "Une erreur est survenue lors de la récupération de la recette",
    };
  }
};

export const createRecipe = async (
  formData: FormData
): Promise<RecipeFormAction> => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        message: "Vous devez être connecté pour créer une recette",
        errors: {},
      };
    }

    // Assurons-nous que isPublic est correctement traité comme un booléen
    const isPublicValue = formData.get("isPublic");
    const isPublic = isPublicValue === "true";

    const validatedFields = RecipeFormSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      bookIds: formData.get("bookIds"),
      isPublic: isPublic,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Champs invalides. Échec de la création de la recette.",
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe`, {
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
        message: errorData.message || "Échec de la création de la recette",
        errors: {},
      };
    }

    // Récupérer l'objet créé avec son ID
    const createdRecipe = await response.json();
    return {
      success: true,
      message: "Recette créée avec succès",
      data: createdRecipe,
    };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la création de la recette",
      errors: {},
    };
  }
};

export const updateRecipe = async (
  id: string,
  formData: FormData
): Promise<RecipeFormAction> => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        message: "Vous devez être connecté pour modifier une recette",
        errors: {},
      };
    }

    // Assurons-nous que isPublic est correctement traité comme un booléen
    const isPublicValue = formData.get("isPublic");
    const isPublic = isPublicValue === "true";

    const validatedFields = RecipeFormSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      bookIds: formData.get("bookIds"),
      isPublic: isPublic,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Champs invalides. Échec de la modification de la recette.",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/recipe/${id}`,
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
        message: errorData.message || "Échec de la modification de la recette",
        errors: {},
      };
    }

    // Pour la cohérence, récupérons aussi les données mises à jour
    const updatedRecipe = await response.json();
    return {
      success: true,
      message: "Recette modifiée avec succès",
      data: updatedRecipe,
    };
  } catch (error) {
    console.error("Error updating recipe:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la modification de la recette",
      errors: {},
    };
  }
};
