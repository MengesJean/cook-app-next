"use client";

import { useSession } from "@/utils/auth/useSession";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type ContentFilterProps = {
  title?: string;
};

export type FilterOption = "all" | "mine";

const ContentFilter = ({ title = "Filtres" }: ContentFilterProps) => {
  const { isAuthenticated } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupérer le filtre actuel depuis l'URL ou utiliser "all" par défaut
  const [activeFilter, setActiveFilter] = useState<FilterOption>(
    (searchParams.get("filter") as FilterOption) || "all"
  );

  // Mettre à jour l'URL lorsque le filtre change
  const updateFilter = useCallback(
    (filter: FilterOption) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("filter", filter);
      router.push(`?${params.toString()}`);
      setActiveFilter(filter);
    },
    [router, searchParams]
  );

  // Si l'utilisateur se déconnecte et que le filtre est "mine", revenir à "all"
  useEffect(() => {
    if (!isAuthenticated && activeFilter === "mine") {
      updateFilter("all");
    }
  }, [isAuthenticated, activeFilter, updateFilter]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow mb-6">
      <h3 className="font-medium mb-3 text-lg">{title}</h3>
      <div className="flex space-x-2">
        <button
          onClick={() => updateFilter("all")}
          disabled={activeFilter === "all"}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeFilter === "all"
              ? "bg-foreground text-background"
              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          Tous
        </button>

        {isAuthenticated && (
          <button
            onClick={() => updateFilter("mine")}
            disabled={activeFilter === "mine"}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeFilter === "mine"
                ? "bg-foreground text-background"
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Mes contenus
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentFilter;
