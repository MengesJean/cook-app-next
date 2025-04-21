"use client";

import Button from "@/components/Button";
import { NavItemType } from "@/components/navigation/NavigationItems";
import SwitchTheme from "@/components/SwitchTheme";
import { useSession } from "@/utils/auth/useSession";
import Link from "next/link";
import { useState } from "react";

// Les mêmes liens que dans NavigationItems
const publicNavItems: NavItemType[] = [
  {
    name: "Accueil",
    slug: "/",
  },
  {
    name: "Recettes",
    slug: "/recipes",
  },
  {
    name: "Livres",
    slug: "/books",
  },
];

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

const MobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="lg:hidden">
      {/* Bouton burger */}
      <button
        onClick={toggleMenu}
        className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay pour fermer le menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        ></div>
      )}

      {/* Menu mobile */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* En-tête du menu */}
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={closeMenu}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Fermer le menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Contenu du menu */}
          <div className="flex-grow overflow-y-auto p-4">
            <nav>
              <ul className="space-y-4">
                {publicNavItems.map((item, index) => (
                  <li key={`mobile-public-${index}`}>
                    <Link
                      href={item.slug}
                      className="block py-2 hover:text-primary transition-colors"
                      onClick={closeMenu}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}

                {isAuthenticated &&
                  privateNavItems.map((item, index) => (
                    <li key={`mobile-private-${index}`}>
                      <Link
                        href={item.slug}
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={closeMenu}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>

          {/* Profil utilisateur */}
          <div className="p-4 border-t dark:border-gray-700">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : user?.email.charAt(0).toUpperCase()}
                  </div>
                  <Link
                    href="/profile"
                    className="text-sm font-medium"
                    onClick={closeMenu}
                  >
                    {user?.name || user?.email}
                  </Link>
                </div>
                <Button
                  variant="danger"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full"
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  href="/login"
                  className="w-full mb-2"
                  onClick={closeMenu}
                >
                  Se connecter
                </Button>
                <Button
                  href="/register"
                  variant="secondary"
                  className="w-full"
                  onClick={closeMenu}
                >
                  S&apos;inscrire
                </Button>
              </div>
            )}

            {/* Thème */}
            <div className="mt-4 flex justify-center">
              <SwitchTheme />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
