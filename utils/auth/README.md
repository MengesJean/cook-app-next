# Gestion de l'Authentification (Frontend)

Ce module implémente la partie frontend du système d'authentification, en s'intégrant avec l'API NestJS pour offrir une expérience utilisateur fluide et sécurisée.

## Architecture

Le système côté frontend utilise :

1. **Server Actions** de Next.js pour toutes les opérations d'authentification
2. **HTTP-only Cookies** pour stocker les tokens de manière sécurisée
3. **Middleware** pour protéger les routes et gérer le rafraîchissement automatique des tokens
4. **Context API** de React pour rendre la session disponible dans les composants clients

## Stockage des Tokens

Deux cookies sont utilisés pour gérer l'authentification :

1. **Access Token** (`access_token`):

   - Courte durée de vie (15 minutes)
   - Utilisé pour authentifier les requêtes API
   - Stocké dans un cookie HTTP-only, Secure, SameSite=Strict

2. **Refresh Token** (`refresh_token`):
   - Longue durée de vie (7 jours)
   - Utilisé uniquement pour obtenir un nouveau access token
   - Stocké dans un cookie HTTP-only, Secure, SameSite=Strict

## Flux d'Authentification

### Connexion (Login)

- L'utilisateur soumet le formulaire de connexion
- L'action serveur valide les données et fait une requête à l'API
- L'API renvoie un access token et un refresh token
- L'action stocke ces tokens dans des cookies HTTP-only
- L'utilisateur est redirigé vers le dashboard

### Protection des Routes

- Le middleware intercepte chaque navigation
- Pour les routes protégées, il vérifie la présence d'un access token valide
- Pour les routes publiques (login/register), il redirige les utilisateurs déjà connectés

### Rafraîchissement Automatique

- Si l'access token est manquant mais qu'un refresh token existe
- Le middleware tente automatiquement de rafraîchir la session
- Si le rafraîchissement réussit, la navigation continue normalement
- Si le rafraîchissement échoue, l'utilisateur est redirigé vers la page de connexion

### Déconnexion (Logout)

- L'utilisateur clique sur "Déconnexion"
- L'action serveur envoie le refresh token à l'API pour le révoquer
- Les cookies sont supprimés côté client
- L'utilisateur est redirigé vers la page de connexion

## Composants Principaux

### Actions Serveur et Utilitaires de Session (`utils/auth/session.actions.ts`)

Le fichier central qui gère toute la logique d'authentification, combinant :

**Gestion des cookies :**

- `setSession`: Stocke les tokens dans des cookies
- `getAccessToken`, `getRefreshToken`: Récupèrent les tokens depuis les cookies
- `deleteSession`: Supprime les cookies de session

**Opérations de rafraîchissement :**

- `refreshSession`: Utilise le refresh token pour obtenir un nouveau access token
- `isAuthenticated`: Vérifie rapidement si l'utilisateur est authentifié

**Actions de session :**

- `getCurrentUser`: Récupère les informations de l'utilisateur connecté
- `logout`: Gère la déconnexion et la révocation des tokens

### Actions d'Authentification (`actions/auth.action.ts`)

- `login`: Gère le processus de connexion
- `register`: Gère le processus d'inscription

### Middleware (`src/middleware.ts`)

- Intercepte les requêtes de navigation
- Gère la protection des routes
- Effectue le rafraîchissement automatique des tokens
- Redirige l'utilisateur selon son état d'authentification

### Context et Hook React (`utils/auth/useSession.tsx`)

- `SessionProvider`: Fournit le contexte d'authentification à l'application
- `useSession`: Hook pour accéder aux informations de session dans les composants clients

## Navigation Conditionnelle

Le système intègre une navigation adaptative qui affiche automatiquement différents liens selon l'état d'authentification de l'utilisateur.

### Composants de Navigation

Le système de navigation est organisé dans le dossier `components/navigation/` avec une architecture modulaire :

- `Navigation.tsx`: Composant principal qui structure la barre de navigation

  - Intègre les liens, boutons de profil et thème
  - Reste un composant serveur pour des performances optimales

- `NavigationItems.tsx`: Gère la liste des liens de navigation

  - Définit les tableaux `publicNavItems` (liens publics) et `privateNavItems` (liens privés)
  - Orchestre l'affichage des différents types de liens

- `NavigationItem.tsx`: Composant serveur pour les liens standards

  - Affiche les liens accessibles à tous les utilisateurs
  - S'occupe du rendu de chaque élément de navigation public

- `NavigationItemWithAuth.tsx`: Composant client pour les liens protégés
  - Utilise le hook `useSession` pour vérifier l'état d'authentification
  - N'affiche les liens que si l'utilisateur est authentifié
  - Gère automatiquement les états de chargement

### Configuration des Liens

La navigation peut être facilement configurée en modifiant les tableaux dans `NavigationItems.tsx` :

```tsx
// Liens accessibles à tous les visiteurs
const publicNavItems: NavItemType[] = [
  { name: "Accueil", slug: "/" },
  { name: "Recettes", slug: "/recipes" },
];

// Liens accessibles uniquement aux utilisateurs connectés
const privateNavItems: NavItemType[] = [
  { name: "Dashboard", slug: "/dashboard" },
  { name: "Mes recettes", slug: "/my-recipes" },
];
```

### Avantages de cette Architecture

1. **Modularité** : Chaque composant a une responsabilité unique et bien définie
2. **Performance** : Seuls les composants nécessitant une interaction client sont des composants clients
3. **Maintenabilité** : Organisation claire facilitant l'évolution du système de navigation
4. **Réutilisabilité** : Les composants peuvent être utilisés dans différents contextes

## Utilisation dans les Composants Clients

Pour accéder à la session dans un composant client, utilisez le hook `useSession` :

```tsx
"use client";

import { useSession } from "../../utils/auth/useSession";

export default function MonComposant() {
  const { user, isLoading, isAuthenticated, refresh, logout } = useSession();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div>
      <h1>Bonjour, {user?.name || user?.email}</h1>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

## Avantages de cette Approche

1. **Sécurité**:

   - Les tokens ne sont jamais exposés au JavaScript client (cookies HTTP-only)
   - Cross-Site Request Forgery (CSRF) protection via SameSite=Strict
   - Rafraîchissement transparent des tokens

2. **Expérience Utilisateur**:

   - Session persistante sans compromis sur la sécurité
   - Pas de déconnexions fréquentes
   - Rafraîchissement automatique et transparent
   - Navigation adaptative selon l'état d'authentification

3. **Simplicité de Développement**:
   - Server Actions pour toutes les opérations d'authentification
   - Architecture consolidée avec toute la logique de session au même endroit
   - Séparation claire des responsabilités
   - Accès facile à la session dans les composants clients

## Structure des Fichiers

```
utils/
└── auth/
    ├── session.actions.ts  # Toutes les fonctions de gestion de session
    ├── useSession.tsx      # Hook React et contexte pour les composants clients
    └── README.md           # Cette documentation
```

## Pour Aller Plus Loin

Ce système pourrait être enrichi avec:

- Une interface de gestion des sessions actives
- Un système de notification lors des connexions suspectes
- Une option "Remember me" pour ajuster la durée du refresh token
