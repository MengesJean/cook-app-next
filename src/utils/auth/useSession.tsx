"use client";

import {
  getCurrentUser,
  logout as serverLogout,
  SessionUser,
} from "@/utils/auth/session.actions";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type SessionContextType = {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

// Création du contexte
const SessionContext = createContext<SessionContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refresh: async () => {},
  logout: async () => {},
});

// Provider qui encapsule l'application
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Fonction pour rafraîchir la session
  const refresh = async () => {
    setIsLoading(true);
    try {
      const { user } = await getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error("Error refreshing session:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour déconnexion
  const logout = async () => {
    try {
      const success = await serverLogout();
      if (success) {
        setUser(null);
        router.push("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Charger la session au montage du composant
  useEffect(() => {
    refresh();
  }, []);

  // Rafraîchir la session à chaque changement de route
  // Ceci est important pour s'assurer que les éléments de navigation sont mis à jour
  // après une connexion ou déconnexion
  useEffect(() => {
    // Pas besoin de rafraîchir si la page est en cours de chargement initial
    if (isLoading) return;

    // Vérifier la session à chaque changement de route
    refresh();
  }, [pathname]);

  return (
    <SessionContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        refresh,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// Hook pour utiliser la session
export function useSession() {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
}
