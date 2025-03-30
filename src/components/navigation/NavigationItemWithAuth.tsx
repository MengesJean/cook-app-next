"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "../../../utils/auth/useSession";

type NavItemType = {
  name: string;
  slug: string;
};

type NavigationItemWithAuthProps = {
  navItem: NavItemType;
};

const NavigationItemWithAuth = ({ navItem }: NavigationItemWithAuthProps) => {
  const { isAuthenticated, isLoading } = useSession();
  const [shouldRender, setShouldRender] = useState(false);
  const pathname = usePathname();

  // Effet pour mettre à jour l'affichage lorsque l'état d'authentification change
  // ou lorsque le chemin de la page change (navigation)
  useEffect(() => {
    // Uniquement mettre à jour si le chargement est terminé
    if (!isLoading) {
      setShouldRender(isAuthenticated);
    }
  }, [isAuthenticated, isLoading, pathname]);

  // Ne rien afficher pendant le chargement ou si non authentifié
  if (!shouldRender) {
    return null;
  }

  // Afficher le lien uniquement si l'utilisateur est authentifié
  return (
    <li>
      <Link
        href={navItem.slug}
        className="hover:text-primary transition-colors"
      >
        {navItem.name}
      </Link>
    </li>
  );
};

export default NavigationItemWithAuth;
