"use client";

import { useEffect, useState } from "react";

type InvitationRow = {
  id: string | number;
  first_name: string;
  email: string;
  association_name: string | null;
  invitation_type: "csuites" | "associates";
  sent_at: string | null;
  last_error: string | null;
  created_at?: string;
};

export function InvitationsAdmin() {
  const [rows, setRows] = useState<InvitationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [invitationType, setInvitationType] = useState<"csuites" | "associates">(
    "csuites",
  );
  const [ctaUrl, setCtaUrl] = useState(
    "https://www.siemenstechsummitsg2026.com/#register",
  );

  async function loadInvitations(options?: { keepLoadingState?: boolean }) {
    if (!options?.keepLoadingState) {
      setLoading(true);
    }
    setError("");
    try {
      const response = await fetch("/api/admin/invitations");
      const body = (await response.json()) as {
        invitations?: InvitationRow[];
        error?: string;
      };

      if (!response.ok) {
        setError(body.error ?? "Failed to fetch invitation records.");
        return;
      }

      setRows(body.invitations ?? []);
    } catch {
      setError("Network error while loading invitation records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadInvitations({ keepLoadingState: true });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function onImport() {
    if (!importFile) {
      setError("Please select an XLSX file first.");
      return;
    }

    setImporting(true);
    setError("");
    setInfo("");

    try {
      const formData = new FormData();
      formData.set("file", importFile);
      formData.set("invitationType", invitationType);
      formData.set("ctaUrl", ctaUrl);

      const response = await fetch("/api/admin/invitations/import", {
        method: "POST",
        body: formData,
      });

      const body = (await response.json()) as {
        error?: string;
        imported?: number;
        failed?: number;
        emailsSent?: number;
      };

      if (!response.ok) {
        setError(body.error ?? "Import failed.");
        return;
      }

      setInfo(
        `Import done: ${body.imported ?? 0} imported, ${body.emailsSent ?? 0} invitations sent, ${body.failed ?? 0} failed.`,
      );
      setImportFile(null);
      await loadInvitations();
    } catch {
      setError("Network error while importing invitations.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Import invitation list and send
          </h2>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/api/admin/invitations/template";
            }}
            className="rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Download Excel template
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Invitation template
            <select
              value={invitationType}
              onChange={(event) =>
                setInvitationType(
                  event.target.value as "csuites" | "associates",
                )
              }
              className="h-10 rounded border border-slate-300 px-3 text-sm outline-none ring-[#00d7c7] focus:ring-2"
            >
              <option value="csuites">C-Suites invitation template</option>
              <option value="associates">Associates invitation template</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm text-slate-700">
            CTA URL
            <input
              type="url"
              value={ctaUrl}
              onChange={(event) => setCtaUrl(event.target.value)}
              className="h-10 rounded border border-slate-300 px-3 text-sm outline-none ring-[#00d7c7] focus:ring-2"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(event) => setImportFile(event.target.files?.[0] ?? null)}
            className="max-w-xs rounded border border-slate-300 px-2 py-1 text-xs"
          />
          <button
            onClick={onImport}
            disabled={importing}
            className="rounded bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {importing ? "Sending..." : "Import + send invitations"}
          </button>
        </div>
      </section>

      {error ? (
        <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {info}
        </p>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Invitation activity</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-600">Loading invitation records...</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Template</th>
                  <th className="px-2 py-2">Sent at</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={String(row.id)} className="border-b border-slate-100">
                    <td className="px-2 py-2">
                      {row.first_name}
                      {row.association_name ? ` (${row.association_name})` : ""}
                    </td>
                    <td className="px-2 py-2">{row.email}</td>
                    <td className="px-2 py-2">{row.invitation_type}</td>
                    <td className="px-2 py-2">
                      {row.sent_at ? new Date(row.sent_at).toLocaleString() : "-"}
                    </td>
                    <td className="px-2 py-2">
                      {row.last_error ? (
                        <span className="text-red-700">Failed</span>
                      ) : row.sent_at ? (
                        <span className="text-emerald-700">Sent</span>
                      ) : (
                        <span className="text-slate-500">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-2 py-4 text-center text-slate-500">
                      No invitation records yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
