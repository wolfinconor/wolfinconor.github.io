"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-pill bg-terracotta px-6 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(login, { error: "" });

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm rounded-card border border-line bg-white p-8">
        <h1 className="mb-1 font-serif text-2xl font-semibold text-charcoal">
          Admin sign in
        </h1>
        <p className="mb-6 text-sm text-warm-gray">
          Buyer Led Representation dashboard admin
        </p>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-charcoal">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-[10px] border border-line bg-white px-3 py-2 text-charcoal outline-none focus:border-terracotta"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-charcoal">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-[10px] border border-line bg-white px-3 py-2 text-charcoal outline-none focus:border-terracotta"
            />
          </div>
          {state?.error && (
            <p className="text-sm font-semibold text-terracotta">{state.error}</p>
          )}
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
