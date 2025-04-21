"use client";

import { getMyBooks } from "@/actions/books.action";
import { createRecipe, updateRecipe } from "@/actions/recipes.action";
import Button from "@/components/Button";
import { FormField } from "@/components/forms/FormField";
import MultiSelect from "@/components/forms/ui/MultiSelect";
import Toggle from "@/components/forms/ui/Toggle";
import { useForm } from "@/hooks/useForm";
import { RecipeFormAction, RecipeFormValues } from "@/schemas/form.types";
import { BookType } from "@/types/Book.type";
import { RecipeType } from "@/types/Recipe.type";
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

  const initialValues: RecipeFormValues = initialRecipe
    ? {
        title: initialRecipe.title,
        description: initialRecipe.description,
        bookIds: initialBookIds,
        isPublic: initialIsPublic,
      }
    : defaultValues;

  const { state, handleChange, setSubmitting, setErrors, getFormData } =
    useForm<RecipeFormValues>(initialValues);

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
    console.log("isPublic changed:", checked);

    const event = {
      target: {
        name: "isPublic",
        value: checked,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    handleChange(event);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    // Utiliser les valeurs de l'état pour la soumission
    const formDataToSubmit = getFormData();
    console.log("Submitting form with isPublic:", state.values.isPublic);

    const action: RecipeFormAction =
      isEditing && initialRecipe?.id
        ? await updateRecipe(initialRecipe.id.toString(), formDataToSubmit)
        : await createRecipe(formDataToSubmit);

    if (action.success) {
      toast.success(action.message);

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
    <form action={handleSubmit} className="space-y-4 max-w-md">
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
