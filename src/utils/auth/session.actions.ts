"use server";

import { cookies } from "next/headers";

export type SessionUser = {
  id: number;
  email: string;
  name: string | null;
};

// Fonctions de gestion des cookies
export const setSession = async (accessToken: string, refreshToken: string) => {
  // Set access token in a short-lived cookie (matching backend expiration)
  const accessTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: accessTokenExpires,
    sameSite: "strict",
    path: "/",
  });

  // Set refresh token in a longer-lived cookie
  const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: refreshTokenExpires,
    sameSite: "strict",
    path: "/", // Changé pour être cohérent
  });
};

export const getAccessToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
};

export const getRefreshToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value;
};

export const refreshSession = async () => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      return false;
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await response.json();
    await setSession(accessToken, newRefreshToken);
    return true;
  } catch (error) {
    console.error("Session refresh error:", error);
    return false;
  }
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    // Call logout endpoint to invalidate the refresh token
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  }

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
};

export const isAuthenticated = async () => {
  const accessToken = await getAccessToken();
  return !!accessToken;
};

// Actions de session
export async function getCurrentUser(): Promise<{ user: SessionUser | null }> {
  try {
    // Récupérer le token d'accès
    const accessToken = await getAccessToken();

    // Si pas de token, l'utilisateur n'est pas connecté
    if (!accessToken) {
      return { user: null };
    }

    // Appeler l'API pour récupérer les informations de l'utilisateur
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Si la requête échoue, l'utilisateur n'est pas connecté ou le token est invalide
    if (!response.ok) {
      return { user: null };
    }

    // Récupérer les données de l'utilisateur
    const userData = await response.json();

    // Retourner les informations de l'utilisateur
    return {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
      },
    };
  } catch (error) {
    console.error("Error fetching user session:", error);
    return { user: null };
  }
}

export async function logout(): Promise<boolean> {
  try {
    // Supprimer la session et les cookies
    await deleteSession();
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    return false;
  }
}
