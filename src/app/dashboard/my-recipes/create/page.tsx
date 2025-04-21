"use client";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import RecipeForm from "@/components/forms/RecipeForm";

export default function CreateRecipePage() {
  return (
    <Container>
      <div className="mb-6">
        <Heading>Créer une nouvelle recette</Heading>
        <p className="text-gray-600 dark:text-gray-400">
          Remplissez le formulaire ci-dessous pour créer votre recette
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <RecipeForm />
      </div>
    </Container>
  );
}
