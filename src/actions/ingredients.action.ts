"use server";

import { getAccessToken } from "../utils/auth/session.actions";

export const getIngredients = async () => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return [];
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ingredient`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return [];
  }
};

export const createIngredient = async (name: string) => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ingredient`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name }),
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error creating ingredient:", error);
    return null;
  }
};
