"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Registration = {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  company: string;
  job_title: string;
  industry?: string | null;
  breakout_track?: string | null;
  challenges?: string[] | null;
  need_timeline?: string | null;
  consent?: boolean | null;
  created_at?: string;
};

type SortKey =
  | "id"
  | "first_name"
  | "last_name"
  | "email"
  | "mobile_number"
  | "job_title"
  | "company"
  | "industry"
  | "breakout_track"
  | "challenges"
  | "need_timeline"
  | "consent"
  | "created_at";

type SortDirection = "asc" | "desc";

type RegistrationFormState = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  jobTitle: string;
  company: string;
};

export function RegistrationsAdmin() {
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [form, setForm] = useState<RegistrationFormState | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const isEditing = useMemo(() => editingId !== null, [editingId]);
  const filteredRows = useMemo(() => {
    const nameFilter = filterName.trim().toLowerCase();
    const emailFilter = filterEmail.trim().toLowerCase();
    const companyFilter = filterCompany.trim().toLowerCase();

    return rows.filter((row) => {
      const fullName = `${row.first_name} ${row.last_name}`.toLowerCase();
      const email = (row.email || "").toLowerCase();
      const company = (row.company || "").toLowerCase();

      return (
        (!nameFilter || fullName.includes(nameFilter)) &&
        (!emailFilter || email.includes(emailFilter)) &&
        (!companyFilter || company.includes(companyFilter))
      );
    });
  }, [rows, filterName, filterEmail, filterCompany]);
  const filteredIds = useMemo(
    () => filteredRows.map((row) => String(row.id)),
    [filteredRows],
  );
  const sortedRows = useMemo(() => {
    const rowsCopy = [...filteredRows];

    const getValue = (row: Registration): string | number => {
      switch (sortKey) {
        case "id":
          return String(row.id);
        case "challenges":
          return (row.challenges ?? []).join(", ");
        case "consent":
          return row.consent === true ? 1 : row.consent === false ? 0 : -1;
        case "created_at":
          return row.created_at ? new Date(row.created_at).getTime() : 0;
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
  }, [filteredRows, sortDirection, sortKey]);
  const areAllFilteredSelected = useMemo(() => {
    if (filteredIds.length === 0) {
      return false;
    }
    const selectedSet = new Set(selectedIds);
    return filteredIds.every((id) => selectedSet.has(id));
  }, [filteredIds, selectedIds]);

  async function loadRegistrations(options?: { keepLoadingState?: boolean }) {
    if (!options?.keepLoadingState) {
      setLoading(true);
    }
    setError("");
    try {
      const response = await fetch("/api/admin/registrations");
      const body = (await response.json()) as {
        registrations?: Registration[];
        error?: string;
      };

      if (!response.ok) {
        setError(body.error ?? "Failed to fetch registrations.");
        return;
      }

      setRows(body.registrations ?? []);
      setSelectedIds((prev) => {
        const available = new Set((body.registrations ?? []).map((row) => String(row.id)));
        return prev.filter((id) => available.has(id));
      });
    } catch {
      setError("Network error while loading registrations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRegistrations({ keepLoadingState: true });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function startEdit(row: Registration) {
    setEditingId(row.id);
    setForm({
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      mobileNumber: row.mobile_number || "",
      jobTitle: row.job_title || "",
      company: row.company || "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId || !form) {
      return;
    }
    setSaving(true);
    setError("");
    setInfo("");

    try {
      const endpoint = `/api/admin/registrations/${editingId}`;
      const method = "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "Failed to save registration.");
        return;
      }

      setInfo("Registration updated.");
      resetForm();
      await loadRegistrations();
    } catch {
      setError("Network error while saving registration.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string | number) {
    if (!window.confirm("Delete this registration?")) {
      return;
    }

    setError("");
    setInfo("");
    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: "DELETE",
      });
      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(body.error ?? "Delete failed.");
        return;
      }

      setInfo("Registration deleted.");
      setSelectedIds((prev) => prev.filter((value) => value !== String(id)));
      await loadRegistrations();
    } catch {
      setError("Network error while deleting registration.");
    }
  }

  function onToggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  }

  function onToggleSelectAllFiltered() {
    if (areAllFilteredSelected) {
      const filteredSet = new Set(filteredIds);
      setSelectedIds((prev) => prev.filter((id) => !filteredSet.has(id)));
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
  }

  function onToggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  }

  async function onSendEmails() {
    if (selectedIds.length === 0) {
      setError("Please select at least one registration before sending emails.");
      setInfo("");
      return;
    }

    setSendingEmails(true);
    setError("");
    setInfo("");
    setEmailErrors([]);

    try {
      const response = await fetch("/api/admin/registrations/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
        }),
      });

      const body = (await response.json()) as {
        error?: string;
        sent?: number;
        failed?: number;
        errors?: string[];
      };

      if (!response.ok) {
        setError(body.error ?? "Failed to send emails.");
        setEmailErrors(body.errors ?? []);
        return;
      }

      setInfo(
        `Email send complete: ${body.sent ?? 0} sent, ${body.failed ?? 0} failed.`,
      );
      setEmailErrors(body.errors ?? []);
    } catch {
      setError("Network error while sending emails.");
    } finally {
      setSendingEmails(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Bulk rejection email sender</h2>
        <p className="mt-1 text-xs text-slate-600">
          Select rows from the table and send rejection email only.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSendEmails}
            disabled={sendingEmails || selectedIds.length === 0}
            className="rounded bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {sendingEmails
              ? "Sending..."
              : `Send rejection email to selected (${selectedIds.length})`}
          </button>
          <span className="text-xs text-slate-500">
            {selectedIds.length === 0 ? "No row selected" : `${selectedIds.length} row(s) selected`}
          </span>
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
      {emailErrors.length > 0 ? (
        <div className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <p className="font-semibold">Send errors</p>
          <p className="mt-1 text-xs text-amber-800">
            {emailErrors.length} recipient(s) failed:
          </p>
          <div className="mt-2 max-h-44 overflow-auto rounded border border-amber-200 bg-white p-2">
            {emailErrors.map((item) => (
              <p key={item} className="text-xs leading-5 text-amber-900">
                - {item}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Registered users</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                window.location.href = "/api/admin/registrations/export";
              }}
              className="rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Export registrations
            </button>
            <button
              type="button"
              onClick={onToggleSelectAllFiltered}
              className="rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              {areAllFilteredSelected ? "Unselect filtered" : "Select all filtered"}
            </button>
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input
            placeholder="Filter by name"
            value={filterName}
            onChange={(event) => setFilterName(event.target.value)}
            className="h-9 rounded border border-slate-300 px-3 text-xs outline-none ring-[#00d7c7] focus:ring-2"
          />
          <input
            placeholder="Filter by email"
            value={filterEmail}
            onChange={(event) => setFilterEmail(event.target.value)}
            className="h-9 rounded border border-slate-300 px-3 text-xs outline-none ring-[#00d7c7] focus:ring-2"
          />
          <input
            placeholder="Filter by company"
            value={filterCompany}
            onChange={(event) => setFilterCompany(event.target.value)}
            className="h-9 rounded border border-slate-300 px-3 text-xs outline-none ring-[#00d7c7] focus:ring-2"
          />
        </div>

        {isEditing && form ? (
          <form
            onSubmit={onSubmit}
            className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2"
          >
            <Input
              label="First name"
              value={form.firstName}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, firstName: value } : prev))
              }
            />
            <Input
              label="Last name"
              value={form.lastName}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, lastName: value } : prev))
              }
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, email: value } : prev))
              }
            />
            <Input
              label="Mobile number"
              value={form.mobileNumber}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, mobileNumber: value } : prev))
              }
            />
            <Input
              label="Job title"
              value={form.jobTitle}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, jobTitle: value } : prev))
              }
            />
            <Input
              label="Company"
              value={form.company}
              onChange={(value) =>
                setForm((prev) => (prev ? { ...prev, company: value } : prev))
              }
            />
            <div className="sm:col-span-2 flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Update"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {loading ? (
          <p className="mt-3 text-sm text-slate-600">Loading registrations...</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-[1700px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="px-2 py-2">Select</th>
                  <SortableHeader
                    label="ID"
                    columnKey="id"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="First name"
                    columnKey="first_name"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Last name"
                    columnKey="last_name"
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
                    label="Mobile number"
                    columnKey="mobile_number"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Job title"
                    columnKey="job_title"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Company"
                    columnKey="company"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Industry"
                    columnKey="industry"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Breakout track"
                    columnKey="breakout_track"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Challenges"
                    columnKey="challenges"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Need timeline"
                    columnKey="need_timeline"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Consent"
                    columnKey="consent"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <SortableHeader
                    label="Created"
                    columnKey="created_at"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                  />
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => (
                  <tr key={String(row.id)} className="border-b border-slate-100">
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(String(row.id))}
                        onChange={() => onToggleSelect(String(row.id))}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </td>
                    <td className="px-2 py-2">{row.id}</td>
                    <td className="px-2 py-2">{row.first_name}</td>
                    <td className="px-2 py-2">{row.last_name}</td>
                    <td className="px-2 py-2">{row.email}</td>
                    <td className="px-2 py-2">{row.mobile_number || "-"}</td>
                    <td className="px-2 py-2">{row.job_title || "-"}</td>
                    <td className="px-2 py-2">{row.company}</td>
                    <td className="px-2 py-2">{row.industry || "-"}</td>
                    <td className="px-2 py-2">{row.breakout_track || "-"}</td>
                    <td className="px-2 py-2">
                      {(row.challenges ?? []).length > 0
                        ? (row.challenges ?? []).join(", ")
                        : "-"}
                    </td>
                    <td className="px-2 py-2">{row.need_timeline || "-"}</td>
                    <td className="px-2 py-2">
                      {row.consent === null || row.consent === undefined
                        ? "-"
                        : row.consent
                          ? "Yes"
                          : "No"}
                    </td>
                    <td className="px-2 py-2">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(row)}
                          className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(row.id)}
                          className="rounded border border-red-300 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedRows.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-2 py-4 text-center text-slate-500">
                      No registrations found for current filters.
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

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
};

function Input({ label, value, onChange, type = "text" }: InputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-700">
      {label}
      <input
        type={type}
        required={label === "First name" || label === "Last name" || label === "Email"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded border border-slate-300 px-3 text-sm outline-none ring-[#00d7c7] focus:ring-2"
      />
    </label>
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
  const indicator = isActive ? (sortDirection === "asc" ? " ▲" : " ▼") : "";

  return (
    <th className="px-2 py-2">
      <button
        type="button"
        onClick={() => onToggleSort(columnKey)}
        className="whitespace-nowrap text-left text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        {label}
        {indicator}
      </button>
    </th>
  );
}
