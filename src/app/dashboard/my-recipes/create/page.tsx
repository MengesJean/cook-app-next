import Container from "@/components/Container";
import RecipeForm from "@/components/forms/RecipeForm";
import Heading from "@/components/Heading";

export default function CreateRecipePage() {
  return (
    <Container>
      <Heading>Créer une recette</Heading>
      <RecipeForm />
    </Container>
  );
}
