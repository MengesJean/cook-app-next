import NavigationItem from "@/components/navigation/NavigationItem";
import NavigationItemWithAuth from "@/components/navigation/NavigationItemWithAuth";
import { Fragment } from "react";

export type NavItemType = {
  name: string;
  slug: string;
};

// Liens accessibles à tous les visiteurs
const publicNavItems: NavItemType[] = [
  {
    name: "Accueil",
    slug: "/",
  },
  {
    name: "Recettes",
    slug: "/recipes",
  },
];

// Liens accessibles uniquement aux utilisateurs connectés
const privateNavItems: NavItemType[] = [
  {
    name: "Dashboard",
    slug: "/dashboard",
  },
  {
    name: "Mes recettes",
    slug: "/dashboard/my-recipes",
  },
  {
    name: "Mes livres",
    slug: "/dashboard/my-books",
  },
];
// Composant qui gère l'affichage des liens de navigation
const NavigationItems = () => {
  return (
    <ul className="flex space-x-4 items-center">
      {publicNavItems.map((item, key) => (
        <Fragment key={key}>
          <NavigationItem navItem={item} />
        </Fragment>
      ))}

      {/* Les liens privés seront automatiquement affichés ou non
          via le composant NavigationItemWithAuth */}
      {privateNavItems.map((item, key) => (
        <Fragment key={key}>
          <NavigationItemWithAuth navItem={item} key={`private-${key}`} />
        </Fragment>
      ))}
    </ul>
  );
};

export default NavigationItems;
