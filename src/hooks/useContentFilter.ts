"use client";

import { FilterOption } from "@/components/filters/ContentFilter";
import { useSession } from "@/utils/auth/useSession";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

// Interface générique qui permet de supporter à la fois les recettes et les livres
export interface ContentItem {
  id?: number;
  [key: string]: unknown;
}

// Hook qui gère le filtrage des contenus (recettes, livres)
export function useContentFilter<T extends ContentItem>(items: T[]) {
  const { user } = useSession();
  const searchParams = useSearchParams();
  const filter = (searchParams.get("filter") as FilterOption) || "all";

  // Filtrer les éléments en fonction du filtre actif
  const filteredItems = useMemo(() => {
    if (!items) return [];

    // Si le filtre est "mine" et que l'utilisateur est connecté,
    // ne montrer que les éléments de l'utilisateur
    if (filter === "mine" && user) {
      return items.filter((item) => item.userId === user.id);
    }

    // Sinon, afficher tous les éléments
    return items;
  }, [items, filter, user]);

  return {
    filteredItems,
    currentFilter: filter,
    isFiltered: filter === "mine",
  };
}
