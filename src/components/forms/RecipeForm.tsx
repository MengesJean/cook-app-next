"use client";

import { createRecipe, updateRecipe } from "@/actions/recipes.action";
import Button from "@/components/Button";
import { FormField } from "@/components/forms/FormField";
import { useForm } from "@/hooks/useForm";
import { RecipeFormAction, RecipeFormValues } from "@/schemas/form.types";
import { RecipeType } from "@/types/Recipe.type";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

type RecipeFormProps = {
  initialRecipe?: RecipeType;
  isEditing?: boolean;
};

const defaultValues: RecipeFormValues = {
  title: "",
  description: "",
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

  const initialValues = initialRecipe
    ? {
        title: initialRecipe.title,
        description: initialRecipe.description,
      }
    : defaultValues;

  const { state, handleChange, setSubmitting, setErrors, getFormData } =
    useForm<RecipeFormValues>(initialValues);

  const handleSubmit = async () => {
    setSubmitting(true);

    // Utiliser les valeurs de l'état pour la soumission
    const formDataToSubmit = getFormData();

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
