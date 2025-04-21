"use client";

import { getMyBooks } from "@/actions/books.action";
import {
  createRecipe,
  getRecipeById,
  updateRecipe,
} from "@/actions/recipes.action";
import Button from "@/components/Button";
import { FormField } from "@/components/forms/FormField";
import IngredientsManager from "@/components/forms/ui/IngredientsManager";
import MultiSelect from "@/components/forms/ui/MultiSelect";
import StepsManager from "@/components/forms/ui/StepsManager";
import Toggle from "@/components/forms/ui/Toggle";
import { useForm } from "@/hooks/useForm";
import { RecipeFormAction, RecipeFormValues } from "@/schemas/form.types";
import { BookType } from "@/types/Book.type";
import { IngredientFormType } from "@/types/Ingredient.type";
import { RecipeType } from "@/types/Recipe.type";
import { StepType } from "@/types/Step.type";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

type RecipeFormProps = {
  initialRecipe?: RecipeType;
  isEditing?: boolean;
};

const defaultValues: RecipeFormValues = {
  title: "",
  description: "",
  bookIds: [],
  isPublic: false,
  recipeIngredients: [],
  steps: [],
};

const SubmitButton = ({ isEditing }: { isEditing?: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? isEditing
          ? "Modification..."
          : "Création..."
        : isEditing
        ? "Modifier la recette"
        : "Créer la recette"}
    </Button>
  );
};

export default function RecipeForm({
  initialRecipe,
  isEditing = false,
}: RecipeFormProps) {
  const router = useRouter();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [recipeDetails, setRecipeDetails] = useState<RecipeType | null>(null);

  // Récupérer les livres de l'utilisateur
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await getMyBooks();
      if (response && response.items) {
        setBooks(response.items);
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

  // Si en mode édition, récupérer les détails complets de la recette
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (isEditing && initialRecipe?.id) {
        const recipeData = await getRecipeById(initialRecipe.id.toString());
        console.log("Détails de la recette chargés:", recipeData);
        setRecipeDetails(recipeData);
      }
    };

    fetchRecipeDetails();
  }, [isEditing, initialRecipe]);

  // Transformer les livres en options pour le MultiSelect
  const bookOptions = books.map((book) => ({
    value: book.id as number,
    label: book.title,
  }));

  // Extraire les IDs des livres de la recette pour l'initialisation
  const initialBookIds =
    initialRecipe?.books
      ?.map((book) => book.id)
      .filter((id): id is number => id !== undefined) || [];

  // S'assurer que isPublic est un booléen
  const initialIsPublic =
    typeof initialRecipe?.isPublic === "boolean"
      ? initialRecipe.isPublic
      : false;

  // Préparer les ingrédients pour l'initialisation
  const prepareIngredients = (): IngredientFormType[] => {
    if (recipeDetails && recipeDetails.recipeIngredients) {
      return recipeDetails.recipeIngredients.map((ri) => ({
        id: ri.id,
        ingredient_id: ri.ingredient?.id || 0,
        name: ri.ingredient?.name || "",
        quantity: ri.quantity,
        unit: ri.unit,
        order: ri.order,
      }));
    }
    return (
      initialRecipe?.recipeIngredients?.map((ri) => ({
        id: ri.id,
        ingredient_id: ri.ingredient?.id || 0,
        name: ri.ingredient?.name || "",
        quantity: ri.quantity,
        unit: ri.unit,
        order: ri.order,
      })) || []
    );
  };

  // Préparer les étapes pour l'initialisation
  const prepareSteps = (): StepType[] => {
    if (recipeDetails && recipeDetails.steps) {
      return recipeDetails.steps.map((step: StepType) => ({
        id: step.id,
        content: step.content,
        order: step.order,
      }));
    }
    return initialRecipe?.steps || [];
  };

  const initialValues: RecipeFormValues = initialRecipe
    ? {
        title: initialRecipe.title,
        description: initialRecipe.description,
        bookIds: initialBookIds,
        isPublic: initialIsPublic,
        recipeIngredients: prepareIngredients(),
        steps: prepareSteps(),
      }
    : defaultValues;

  const { state, handleChange, setSubmitting, setErrors, getFormData } =
    useForm<RecipeFormValues>(initialValues);

  // Mettre à jour le formulaire lorsque les détails complets sont chargés
  useEffect(() => {
    if (recipeDetails) {
      const updatedValues = {
        ...state.values,
        recipeIngredients: prepareIngredients(),
        steps: prepareSteps(),
      };

      // Mettre à jour manuellement les valeurs
      Object.entries(updatedValues).forEach(([key, value]) => {
        const event = {
          target: {
            name: key,
            value: value,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        handleChange(event);
      });
    }
  }, [recipeDetails]);

  // Crée un gestionnaire d'événement personnalisé pour mettre à jour bookIds
  const handleBookChange = (selectedBooks: (string | number)[]) => {
    // Convertit les IDs en nombres
    const bookIds = selectedBooks.map((id) =>
      typeof id === "string" ? parseInt(id, 10) : id
    );

    // Crée un événement synthétique pour handleChange
    const event = {
      target: {
        name: "bookIds",
        value: bookIds,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    handleChange(event);
  };

  // Gestionnaire pour le toggle isPublic
  const handleIsPublicChange = (checked: boolean) => {
    const event = {
      target: {
        name: "isPublic",
        value: checked,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    handleChange(event);
  };

  // Gestionnaire pour les ingrédients
  const handleIngredientsChange = (ingredients: IngredientFormType[]) => {
    console.log("Ingrédients mis à jour:", ingredients);
    const event = {
      target: {
        name: "recipeIngredients",
        value: ingredients,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    handleChange(event);
  };

  // Gestionnaire pour les étapes
  const handleStepsChange = (steps: StepType[]) => {
    console.log("Étapes mises à jour:", steps);
    const event = {
      target: {
        name: "steps",
        value: steps,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    handleChange(event);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    console.log("Données du formulaire avant soumission:", state.values);

    // Utiliser les valeurs de l'état pour la soumission
    const formDataToSubmit = getFormData();

    const action: RecipeFormAction =
      isEditing && initialRecipe?.id
        ? await updateRecipe(initialRecipe.id.toString(), formDataToSubmit)
        : await createRecipe(formDataToSubmit);

    if (action.success) {
      toast.success(action.message);

      // Redirection après succès
      if (isEditing && initialRecipe?.id) {
        router.push(`/dashboard/my-recipes/${initialRecipe.id}`);
      } else if (action.data?.id) {
        router.push(`/dashboard/my-recipes/${action.data.id}`);
      } else {
        router.push("/dashboard/my-recipes");
      }
    } else {
      setErrors(action.errors || {}, action.message);
      toast.error(action.message);
    }
  };

  // S'assurer que isPublic est toujours un booléen pour le composant Toggle
  const isPublicValue =
    typeof state.values.isPublic === "boolean" ? state.values.isPublic : false;

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <FormField
            name="title"
            label="Titre"
            value={state.values.title}
            errors={state.errors.title}
            onChange={handleChange}
          />

          <FormField
            name="description"
            label="Description"
            type="textarea"
            value={state.values.description}
            errors={state.errors.description}
            onChange={handleChange}
          />

          <Toggle
            id="isPublic"
            name="isPublic"
            label="Recette publique"
            checked={isPublicValue}
            errors={state.errors.isPublic}
            hasError={Boolean(state.errors.isPublic?.length)}
            onChange={handleIsPublicChange}
          />

          {!loading && (
            <MultiSelect
              id="bookIds"
              name="bookIds"
              label="Livres"
              options={bookOptions}
              selectedValues={state.values.bookIds}
              errors={state.errors.bookIds}
              hasError={Boolean(state.errors.bookIds?.length)}
              placeholder="Sélectionner des livres..."
              onChange={handleBookChange}
            />
          )}
        </div>
      </div>

      <IngredientsManager
        ingredients={state.values.recipeIngredients || []}
        onChange={handleIngredientsChange}
        hasErrors={Boolean(state.errors.recipeIngredients?.length)}
        errorMessage={state.errors.recipeIngredients?.[0]}
      />

      <StepsManager
        steps={state.values.steps || []}
        onChange={handleStepsChange}
        hasErrors={Boolean(state.errors.steps?.length)}
        errorMessage={state.errors.steps?.[0]}
      />

      {state.message &&
        state.errors &&
        Object.keys(state.errors).length > 0 && (
          <div className="text-red-500 text-sm">{state.message}</div>
        )}

      <div className="flex gap-2">
        <SubmitButton isEditing={isEditing} />
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            router.push(
              isEditing && initialRecipe?.id
                ? `/dashboard/my-recipes/${initialRecipe.id}`
                : "/dashboard/my-recipes"
            )
          }
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
