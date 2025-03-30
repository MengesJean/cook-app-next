# 🍲 Cook App - Application de Recettes

> **⚠️ PROJET EN COURS DE DÉVELOPPEMENT ⚠️**

Une application moderne de gestion et partage de recettes de cuisine, construite avec Next.js 15 et utilisant une API NestJS.

## 📋 À propos

Cook App est une plateforme complète permettant aux utilisateurs de découvrir, créer, partager et gérer leurs recettes préférées. L'application offre une expérience utilisateur fluide et intuitive, avec une architecture moderne basée sur les Server Components et Server Actions de Next.js.

## 🚀 Fonctionnalités

- **🔐 Authentification sécurisée** : Système d'authentification JWT avec refresh tokens
- **📱 Responsive Design** : Interface adaptée à tous les appareils
- **🔍 Recherche de recettes** : Filtres avancés par catégorie, ingrédients, temps de préparation
- **👤 Profils utilisateurs** : Création et gestion de profils personnalisés
- **❤️ Collection de favoris** : Sauvegarde des recettes préférées
- **📝 Création de recettes** : Éditeur intuitif avec formatage riche
- **🌙 Mode sombre** : Thème clair/sombre pour un confort de lecture optimal

## 🛠️ Technologies

- **Next.js 15 (App Router)**
- **React Server Components**
- **Server Actions**
- **Tailwind CSS**
- **TypeScript**

## 🏗️ Architecture

L'application utilise l'App Router de Next.js avec :

- Server Components pour le rendu côté serveur
- Server Actions pour les opérations de mutation
- Context API pour la gestion de session côté client

## 🚦 Installation et démarrage

### Prérequis

- Node.js 18+

### Configuration

```bash
# Cloner le dépôt
git clone https://github.com/MengesJean/cook-app-next.git
cd cook-app-next

# Installer les dépendances
npm install
```

### Variables d'environnement

Créez un fichier `.env.development` à la racine du projet :

```
NEXT_PUBLIC_API_URL=
```

### Démarrage

```bash
# Démarrer l'application
npm run dev
```

## 📚 Documentation

Pour plus de détails sur les différentes parties de l'application :

- [Documentation d'authentification](./utils/auth/README.md)
- [Documentation de l'API](https://github.com/MengesJean/cook-app-api)

## 📝 License

[MIT](LICENSE)
