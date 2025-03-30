"use client";

import Link from "next/link";
import { useSession } from "../../utils/auth/useSession";
import Button from "./Button";

const UserProfileButton = () => {
  const { user, isLoading, isAuthenticated, logout } = useSession();

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex space-x-2">
        <Button href="/register">S&apos;inscrire</Button>
        <Button href="/login">Se connecter</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : user?.email.charAt(0).toUpperCase()}
        </div>
        <Link href="/profile" className="text-sm font-medium">
          {user?.name || user?.email}
        </Link>
      </div>
      <Button variant="danger" onClick={() => logout()}>
        Déconnexion
      </Button>
    </div>
  );
};

export default UserProfileButton;
