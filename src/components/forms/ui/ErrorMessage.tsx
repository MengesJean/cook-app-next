"use client";

type ErrorMessageProps = {
  id?: string;
  errors?: string[];
};

export default function ErrorMessage({ id, errors }: ErrorMessageProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div id={id} className="text-red-500 text-sm">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}
