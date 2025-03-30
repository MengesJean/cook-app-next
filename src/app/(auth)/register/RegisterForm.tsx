"use client";
import { register } from "@/actions/auth.action";
import Button from "@/components/Button";
import { useActionState, useRef } from "react";

const RegisterForm = () => {
  const [state, action, pending] = useActionState(register, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form className="space-y-4" action={action} ref={formRef}>
      {state?.message && (
        <p className="text-red-500 text-sm mt-1">{state.message}</p>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full px-3 py-2 border rounded-md"
          required
          defaultValue={state?.values?.name || ""}
        />
        {state?.errors?.name && (
          <p className="text-red-500 text-sm mt-1">
            {state.errors.name.join(", ")}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-3 py-2 border rounded-md"
          required
          defaultValue={state?.values?.email || ""}
        />
        {state?.errors?.email && (
          <p className="text-red-500 text-sm mt-1">
            {state.errors.email.join(", ")}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full px-3 py-2 border rounded-md"
          required
          defaultValue={state?.values?.password || ""}
        />
        {state?.errors?.password && (
          <p className="text-red-500 text-sm mt-1">
            {state.errors.password.join(", ")}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-1"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="w-full px-3 py-2 border rounded-md"
          required
          defaultValue={state?.values?.confirmPassword || ""}
        />
        {state?.errors?.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {state.errors.confirmPassword.join(", ")}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;
