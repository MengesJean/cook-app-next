"use server";

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
