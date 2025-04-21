"use client";

import { createBook, updateBook } from "@/actions/books.action";
import Button from "@/components/Button";
import { FormField } from "@/components/forms/FormField";
import { useForm } from "@/hooks/useForm";
import { BookFormAction, BookFormValues } from "@/schemas/form.types";
import { BookType } from "@/types/Book.type";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import Toggle from "./ui/Toggle";

type BookFormProps = {
  initialBook?: BookType;
  isEditing?: boolean;
};

const defaultValues: BookFormValues = {
  title: "",
  description: "",
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
        ? "Modifier le livre"
        : "Créer le livre"}
    </Button>
  );
};

export default function BookForm({
  initialBook,
  isEditing = false,
}: BookFormProps) {
  const router = useRouter();

  const initialValues = initialBook
    ? {
        title: initialBook.title,
        description: initialBook.description,
        isPublic: initialBook.isPublic,
      }
    : defaultValues;

  const { state, handleChange, setSubmitting, setErrors, getFormData } =
    useForm<BookFormValues>(initialValues);

  const handleSubmit = async () => {
    setSubmitting(true);

    // Utiliser les valeurs de l'état pour la soumission
    const formDataToSubmit = getFormData();

    const action: BookFormAction =
      isEditing && initialBook?.id
        ? await updateBook(initialBook.id.toString(), formDataToSubmit)
        : await createBook(formDataToSubmit);

    if (action.success) {
      toast.success(action.message);

      if (isEditing && initialBook?.id) {
        router.push(`/dashboard/my-books/${initialBook.id}`);
      } else if (action.data?.id) {
        router.push(`/dashboard/my-books/${action.data.id}`);
      } else {
        router.push("/dashboard/my-books");
      }
    } else {
      setErrors(action.errors || {}, action.message);
      toast.error(action.message);
    }
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
              isEditing && initialBook?.id
                ? `/dashboard/my-books/${initialBook.id}`
                : "/dashboard/my-books"
            )
          }
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
