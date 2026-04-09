"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md space-y-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-100">
              Forgot password
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <p className="text-center text-sm text-green-600 dark:text-green-400">
                Check your email for a reset link
              </p>
              <Link
                href="/login"
                className="block text-center text-sm font-medium text-gray-900 hover:underline dark:text-neutral-100"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-neutral-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-500"
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-200"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <p className="mt-6 text-center text-sm text-gray-600 dark:text-neutral-400">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-medium text-gray-900 hover:underline dark:text-neutral-100"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
