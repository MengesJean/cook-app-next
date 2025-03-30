"use client";
import Button from "@/components/Button";
import { useActionState, useRef } from "react";
import { login } from "../../../../actions/auth.action";

const LoginForm = () => {
  const [state, action, pending] = useActionState(login, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form className="space-y-4" action={action} ref={formRef}>
      {state?.message && (
        <p className="text-red-500 text-sm mt-1">{state.message}</p>
      )}

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

      <Button type="submit" className="w-full" disabled={pending}>
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
