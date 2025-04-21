"use server";

import { RecipeFormAction } from "@/schemas/form.types";
import { RecipeFormSchema } from "@/schemas/recipe.schema";
import { IngredientType } from "@/types/Ingredient.type";
import { StepType } from "@/types/Step.type";
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

    // Récupérer et parser les ingrédients et étapes
    const ingredientsJson = formData.get("recipeIngredients");
    const stepsJson = formData.get("steps");

    // Analyser les ingrédients et étapes avec sécurité
    let ingredients: IngredientType[] = [];
    let steps: StepType[] = [];

    try {
      if (ingredientsJson) {
        if (typeof ingredientsJson === "string") {
          ingredients = JSON.parse(ingredientsJson);
        } else if (Array.isArray(ingredientsJson)) {
          // Si c'est déjà un tableau, utiliser directement
          ingredients = ingredientsJson;
        } else {
          console.warn(
            "ingredientsJson n'est pas une chaîne ou un tableau, conversion forcée"
          );
          ingredients = JSON.parse(String(ingredientsJson));
        }
      }
    } catch (error) {
      console.error("Erreur lors du parsing des ingrédients:", error);
    }

    try {
      if (stepsJson) {
        if (typeof stepsJson === "string") {
          steps = JSON.parse(stepsJson);
        } else if (Array.isArray(stepsJson)) {
          // Si c'est déjà un tableau, utiliser directement
          steps = stepsJson;
        } else {
          console.warn(
            "stepsJson n'est pas une chaîne ou un tableau, conversion forcée"
          );
          steps = JSON.parse(String(stepsJson));
        }
      }
    } catch (error) {
      console.error("Erreur lors du parsing des étapes:", error);
    }

    console.log("Ingrédients à envoyer:", ingredients);
    console.log("Étapes à envoyer:", steps);

    // Validation de base des champs du formulaire
    const validatedFields = RecipeFormSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      bookIds: formData.get("bookIds"),
      isPublic: isPublic,
      recipeIngredients: ingredients,
      steps: steps,
    });

    console.log("Validated fields:", validatedFields);
    console.log(
      "Ingredients after validation:",
      validatedFields.success ? validatedFields.data.recipeIngredients : []
    );

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Champs invalides. Échec de la création de la recette.",
      };
    }
    console.log("validatedFields", validatedFields);
    // Formater les données pour l'API
    const payload = {
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      isPublic: validatedFields.data.isPublic,
      bookIds: validatedFields.data.bookIds,
      ingredients: validatedFields.data.recipeIngredients?.map((ingredient) => {
        // Si ingredient_id est 0, on le supprime pour créer un nouvel ingrédient
        if (ingredient.ingredient_id === 0) {
          return {
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            order: ingredient.order,
          };
        }
        return {
          ingredient_id: ingredient.ingredient_id,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          order: ingredient.order,
        };
      }),
      steps: validatedFields.data.steps?.map((step: StepType) => ({
        content: step.content,
        order: step.order,
      })),
    };

    console.log("Payload envoyé à l'API:", JSON.stringify(payload, null, 2));

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    // Vérifier la réponse brute pour diagnostiquer les problèmes
    const responseText = await response.text();
    let responseData = null;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.error("Réponse non-JSON:", responseText);
    }

    if (!response.ok) {
      return {
        success: false,
        message: responseData?.message || "Échec de la création de la recette",
        errors: {},
      };
    }

    return {
      success: true,
      message: "Recette créée avec succès",
      data: responseData,
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

    // Récupérer et parser les ingrédients et étapes
    const ingredientsJson = formData.get("recipeIngredients");
    const stepsJson = formData.get("steps");

    // Analyser les ingrédients et étapes avec sécurité
    let ingredients: IngredientType[] = [];
    let steps: StepType[] = [];

    try {
      if (ingredientsJson) {
        if (typeof ingredientsJson === "string") {
          ingredients = JSON.parse(ingredientsJson);
        } else if (Array.isArray(ingredientsJson)) {
          // Si c'est déjà un tableau, utiliser directement
          ingredients = ingredientsJson;
        } else {
          console.warn(
            "ingredientsJson n'est pas une chaîne ou un tableau, conversion forcée"
          );
          ingredients = JSON.parse(String(ingredientsJson));
        }
      }
    } catch (error) {
      console.error("Erreur lors du parsing des ingrédients:", error);
    }

    try {
      if (stepsJson) {
        if (typeof stepsJson === "string") {
          steps = JSON.parse(stepsJson);
        } else if (Array.isArray(stepsJson)) {
          // Si c'est déjà un tableau, utiliser directement
          steps = stepsJson;
        } else {
          console.warn(
            "stepsJson n'est pas une chaîne ou un tableau, conversion forcée"
          );
          steps = JSON.parse(String(stepsJson));
        }
      }
    } catch (error) {
      console.error("Erreur lors du parsing des étapes:", error);
    }

    console.log("Ingrédients à mettre à jour:", ingredients);
    console.log("Étapes à mettre à jour:", steps);

    // Validation de base des champs du formulaire
    const validatedFields = RecipeFormSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      bookIds: formData.get("bookIds"),
      isPublic: isPublic,
      recipeIngredients: ingredients,
      steps: steps,
    });

    console.log("Validated fields:", validatedFields);
    console.log(
      "Ingredients after validation:",
      validatedFields.success ? validatedFields.data.recipeIngredients : []
    );

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Champs invalides. Échec de la modification de la recette.",
      };
    }

    // Formater les données pour l'API
    const payload = {
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      isPublic: validatedFields.data.isPublic,
      bookIds: validatedFields.data.bookIds,
      ingredients: validatedFields.data.recipeIngredients?.map((ingredient) => {
        // Si ingredient_id est 0, on le supprime pour créer un nouvel ingrédient
        if (ingredient.ingredient_id === 0) {
          return {
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            order: ingredient.order,
          };
        }
        return {
          ingredient_id: ingredient.ingredient_id,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          order: ingredient.order,
        };
      }),
      steps: validatedFields.data.steps?.map((step: StepType) => {
        const result = {
          content: step.content,
          order: step.order,
        } as StepType;

        if (step.id && step.id > 0) {
          result.id = step.id;
        }

        return result;
      }),
    };

    console.log("Payload envoyé à l'API:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/recipe/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    // Vérifier la réponse brute pour diagnostiquer les problèmes
    const responseText = await response.text();
    let responseData = null;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.error("Réponse non-JSON:", responseText);
    }

    if (!response.ok) {
      return {
        success: false,
        message:
          responseData?.message || "Échec de la modification de la recette",
        errors: {},
      };
    }

    return {
      success: true,
      message: "Recette modifiée avec succès",
      data: responseData,
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
