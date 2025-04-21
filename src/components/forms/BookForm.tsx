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

type BookFormProps = {
  initialBook?: BookType;
  isEditing?: boolean;
};

const defaultValues: BookFormValues = {
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
        router.push(`/dashboard/books/${initialBook.id}`);
      } else if (action.data?.id) {
        router.push(`/dashboard/books/${action.data.id}`);
      } else {
        router.push("/dashboard/books");
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
              isEditing && initialBook?.id
                ? `/dashboard/books/${initialBook.id}`
                : "/dashboard/books"
            )
          }
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
