"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "Login failed.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter the admin password to manage registrations and invitations.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 rounded border border-slate-300 px-3 text-sm outline-none ring-[#00d7c7] focus:ring-2"
            />
          </label>

          {error ? (
            <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center rounded bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
