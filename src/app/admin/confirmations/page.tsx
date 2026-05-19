"use client";

import { FormEvent, useState } from "react";

import { ConfirmationsHeader } from "@/components/admin/confirmations-header";

export default function ConfirmationsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Choose an Excel (.xlsx) or CSV file first.");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const formData = new FormData();
      formData.set("file", file);

      const response = await fetch("/api/admin/confirmations/import-send", {
        method: "POST",
        body: formData,
      });

      const body = (await response.json()) as {
        error?: string;
        sent?: number;
        failed?: number;
        processed?: number;
        totalRows?: number;
        errors?: string[];
      };

      if (!response.ok) {
        setError(body.error ?? "Import failed.");
        return;
      }

      setSummary(
        `Done. Rows: ${body.totalRows ?? 0}, sent: ${body.sent ?? 0}, failed: ${body.failed ?? 0}.`,
      );
      if (body.errors && body.errors.length > 0) {
        setError(body.errors.slice(0, 12).join("\n"));
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <ConfirmationsHeader />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Send confirmations + QR</h1>
        <p className="mt-2 text-sm text-slate-600">
          Fill in the template with each registrant’s <strong>registration_id</strong> (from the
          main admin export), <strong>ticket_id</strong>, and optional email for a sanity check.
          Each row must be an <strong>approved</strong> registration. Uploading runs: save ticket
          id → send Resend confirmation → attach QR PNG → mark confirmation sent.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/api/admin/confirmations/template"
            className="inline-flex items-center rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Download Excel template
          </a>
          <a
            href="/api/admin/confirmations/template-csv"
            className="inline-flex items-center rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Download CSV template
          </a>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Import file
            <input
              type="file"
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !file}
            className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Working…" : "Import and send emails"}
          </button>
        </form>

        {summary ? (
          <p className="mt-4 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {summary}
          </p>
        ) : null}

        {error ? (
          <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950">
            {error}
          </pre>
        ) : null}
      </div>
    </main>
  );
}
