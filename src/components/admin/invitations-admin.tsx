"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type InvitationRow = {
  id: string | number;
  first_name: string;
  email: string;
  association_name: string | null;
  invitation_type: "default" | "csuites" | "associates";
  sent_at: string | null;
  last_error: string | null;
  created_at?: string;
};

type SortKey =
  | "first_name"
  | "email"
  | "association_name"
  | "invitation_type"
  | "sent_at"
  | "status"
  | "created_at";

type SortDirection = "asc" | "desc";

export function InvitationsAdmin() {
  const [rows, setRows] = useState<InvitationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [sendingIndividual, setSendingIndividual] = useState(false);
  const [individualFirstName, setIndividualFirstName] = useState("");
  const [individualEmail, setIndividualEmail] = useState("");
  const [individualAssociationName, setIndividualAssociationName] = useState("");
  const [invitationType, setInvitationType] = useState<
    "default" | "csuites" | "associates"
  >(
    "default",
  );
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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

  async function onSendIndividual(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const firstName = individualFirstName.trim();
    const email = individualEmail.trim();
    const associationName = individualAssociationName.trim();

    if (!firstName || !email || !associationName) {
      setError("Name, email and associate name are required.");
      setInfo("");
      return;
    }

    setSendingIndividual(true);
    setError("");
    setInfo("");

    try {
      const response = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          associationName,
          invitationType,
        }),
      });

      const body = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        setError(body.error ?? "Failed to send invitation email.");
        return;
      }

      setInfo(body.message ?? "Invitation sent.");
      setIndividualFirstName("");
      setIndividualEmail("");
      setIndividualAssociationName("");
      await loadInvitations({ keepLoadingState: true });
    } catch {
      setError("Network error while sending invitation email.");
    } finally {
      setSendingIndividual(false);
    }
  }

  const sortedRows = useMemo(() => {
    const rowsCopy = [...rows];

    const getStatusRank = (row: InvitationRow) => {
      if (row.last_error) {
        return 0;
      }
      if (row.sent_at) {
        return 2;
      }
      return 1;
    };

    const getValue = (row: InvitationRow): string | number => {
      switch (sortKey) {
        case "status":
          return getStatusRank(row);
        case "sent_at":
        case "created_at":
          return row[sortKey] ? new Date(row[sortKey] as string).getTime() : 0;
        default:
          return String(row[sortKey] ?? "");
      }
    };

    rowsCopy.sort((a, b) => {
      const left = getValue(a);
      const right = getValue(b);

      if (typeof left === "number" && typeof right === "number") {
        return sortDirection === "asc" ? left - right : right - left;
      }

      const compared = String(left).localeCompare(String(right), undefined, {
        sensitivity: "base",
        numeric: true,
      });
      return sortDirection === "asc" ? compared : -compared;
    });

    return rowsCopy;
  }, [rows, sortDirection, sortKey]);

  function onToggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
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

        <div className="mt-4 grid gap-3 sm:grid-cols-1">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Invitation template
            <select
              value={invitationType}
              onChange={(event) =>
                setInvitationType(
                  event.target.value as "default" | "csuites" | "associates",
                )
              }
              className="h-10 rounded border border-slate-300 px-3 text-sm outline-none ring-[#00d7c7] focus:ring-2"
            >
              <option value="default">General invitation template</option>
              <option value="csuites">C-Suites invitation template</option>
              <option value="associates">Associates invitation template</option>
            </select>
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

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Send individual invitation email
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Enter recipient details and send one invitation immediately.
        </p>

        <form
          onSubmit={onSendIndividual}
          className="mt-4 grid gap-3 sm:grid-cols-3"
        >
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Name
            <input
              type="text"
              required
              value={individualFirstName}
              onChange={(event) => setIndividualFirstName(event.target.value)}
              className="h-10 rounded border border-slate-300 px-3 text-sm outline-none ring-[#00d7c7] focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Email
            <input
              type="email"
              required
              value={individualEmail}
              onChange={(event) => setIndividualEmail(event.target.value)}
              className="h-10 rounded border border-slate-300 px-3 text-sm outline-none ring-[#00d7c7] focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Associate name
            <input
              type="text"
              required
              value={individualAssociationName}
              onChange={(event) => setIndividualAssociationName(event.target.value)}
              className="h-10 rounded border border-slate-300 px-3 text-sm outline-none ring-[#00d7c7] focus:ring-2"
            />
          </label>
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={sendingIndividual}
              className="rounded bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {sendingIndividual ? "Sending..." : "Send individual invitation"}
            </button>
          </div>
        </form>
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
                  <SortableHeader
                    label="Name"
                    columnKey="first_name"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Email"
                    columnKey="email"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Association"
                    columnKey="association_name"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Template"
                    columnKey="invitation_type"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Sent at"
                    columnKey="sent_at"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Status"
                    columnKey="status"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => (
                  <tr key={String(row.id)} className="border-b border-slate-100">
                    <td className="px-2 py-2">{row.first_name}</td>
                    <td className="px-2 py-2">{row.email}</td>
                    <td className="px-2 py-2">{row.association_name || "-"}</td>
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
                {sortedRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-2 py-4 text-center text-slate-500">
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

type SortableHeaderProps = {
  label: string;
  columnKey: SortKey;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onToggleSort: (key: SortKey) => void;
};

function SortableHeader({
  label,
  columnKey,
  sortKey,
  sortDirection,
  onToggleSort,
}: SortableHeaderProps) {
  const isActive = sortKey === columnKey;
  const indicator = isActive ? (sortDirection === "asc" ? "↑" : "↓") : "↕";

  return (
    <th className="px-2 py-2">
      <button
        type="button"
        onClick={() => onToggleSort(columnKey)}
        className={`inline-flex items-center gap-1 whitespace-nowrap rounded border px-2 py-1 text-left text-xs font-semibold transition ${
          isActive
            ? "border-[#00d7c7] bg-[#e9fffb] text-slate-900"
            : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
        }`}
        aria-label={`Sort by ${label}`}
      >
        <span>{label}</span>
        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded border border-current px-0.5 text-[10px] leading-none">
          {indicator}
        </span>
      </button>
    </th>
  );
}
