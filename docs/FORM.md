# Form System Documentation

This document explains the form architecture and implementation in the Cook App project.

## Overview

The form system in this project is built around:

- A reusable custom hook `useForm` for form state management
- A shared `FormField` component for standardized form inputs
- Type safety with TypeScript
- Server Actions for form submission
- Robust error handling

## Form Hook: `useForm`

Located in `src/hooks/useForm.ts`, this custom hook provides a consistent way to manage form state across all forms.

### Features

- Typed form values via generics
- Unified state for values, errors, submission status, and form messages
- Utility functions for common form operations

### API

```tsx
const {
  state, // Current form state
  handleChange, // Input change handler
  setSubmitting, // Update submission status
  setErrors, // Update form errors
  resetForm, // Reset form to initial state
  getFormData, // Create FormData object from values
} = useForm<FormValuesType>(initialValues);
```

### State Structure

```tsx
interface FormState<T> {
  values: T; // Form values
  errors: Record<string, string[]>; // Validation errors
  message: string | null; // Form-level message
  isSubmitting: boolean; // Submission status
}
```

## FormField Component

Located in `src/components/forms/FormField.tsx`, this component:

- Provides a consistent UI for form inputs
- Handles display of validation errors
- Supports text inputs, textareas, and potentially other input types
- Maintains accessibility best practices

## Creating a Form

To create a new form:

1. Define a type for your form values in `src/schemas/form.types.ts`
2. Create default values
3. Use the `useForm` hook with your type
4. Create a form submission handler
5. Implement the form UI using `FormField` components

### Example Implementation

```tsx
// Define form values type
type ExampleFormValues = {
  title: string;
  description: string;
};

// Set default values
const defaultValues: ExampleFormValues = {
  title: "",
  description: "",
};

// In your component
export default function ExampleForm() {
  const { state, handleChange, setSubmitting, setErrors, getFormData } =
    useForm<ExampleFormValues>(defaultValues);

  const handleSubmit = async () => {
    setSubmitting(true);
    const formData = getFormData();

    // Submit using a server action
    const result = await yourServerAction(formData);

    if (result.success) {
      // Handle success
    } else {
      setErrors(result.errors || {}, result.message);
    }
  };

  return (
    <form action={handleSubmit}>
      <FormField
        name="title"
        label="Title"
        value={state.values.title}
        errors={state.errors.title}
        onChange={handleChange}
      />

      {/* More form fields */}

      <button type="submit" disabled={state.isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

## Form Submission

Forms in this project use React Server Actions for submission. The typical flow is:

1. Prevent default form submission (for client-side forms) or use `action` prop (for server action forms)
2. Set the form to submitting state
3. Convert form values to FormData using `getFormData()`
4. Call the server action with the form data
5. Handle the response:
   - On success: show success message, navigate, or perform other actions
   - On failure: update form with errors

## Error Handling

Errors are displayed in two ways:

- Field-specific errors appear below the relevant input
- Form-level messages appear at the top of the form

The `setErrors` function handles updating both:

```tsx
setErrors(
  { fieldName: ["Error message"] }, // Field errors
  "Overall form error message" // Form message
);
```

## Form Types

The project includes several form implementations:

1. **Authentication Forms**

   - Login (`src/app/(auth)/login/LoginForm.tsx`)
   - Register (`src/app/(auth)/register/RegisterForm.tsx`)

2. **Content Forms**
   - Recipe Form (`src/components/forms/RecipeForm.tsx`)
   - Book Form (`src/components/forms/BookForm.tsx`)

Each form follows the same pattern using `useForm` and `FormField` components, ensuring a consistent user experience and development pattern.

## Best Practices

When working with forms in this project:

1. Always define proper types for form values
2. Use the `useForm` hook for state management
3. Use `FormField` components for input fields
4. Handle errors at both field and form levels
5. Follow the established submission pattern
6. Keep forms focused on a single purpose
7. Place form components in appropriate directories:
   - Reusable forms in `src/components/forms/`
   - Route-specific forms in their route directories

By following these patterns, you'll maintain consistency across the application and leverage the built-in capabilities of the form system.
