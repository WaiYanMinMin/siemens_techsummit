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
  created_at?: string;
};

type RegistrationFormState = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  jobTitle: string;
  company: string;
};

const emptyForm: RegistrationFormState = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  jobTitle: "",
  company: "",
};

export function RegistrationsAdmin() {
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [form, setForm] = useState<RegistrationFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

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
    setForm(emptyForm);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setInfo("");

    try {
      const endpoint = editingId
        ? `/api/admin/registrations/${editingId}`
        : "/api/admin/registrations";
      const method = editingId ? "PUT" : "POST";

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

      setInfo(editingId ? "Registration updated." : "Registration created.");
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
      await loadRegistrations();
    } catch {
      setError("Network error while deleting registration.");
    }
  }

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

      const response = await fetch("/api/admin/registrations/import", {
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
        `Import done: ${body.imported ?? 0} imported, ${body.failed ?? 0} failed, ${body.emailsSent ?? 0} confirmation emails sent.`,
      );
      setImportFile(null);
      await loadRegistrations();
    } catch {
      setError("Network error while importing registrations.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {isEditing ? "Edit registration" : "Add registration"}
        </h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input
            label="First name"
            value={form.firstName}
            onChange={(value) => setForm((prev) => ({ ...prev, firstName: value }))}
          />
          <Input
            label="Last name"
            value={form.lastName}
            onChange={(value) => setForm((prev) => ({ ...prev, lastName: value }))}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
          />
          <Input
            label="Mobile number"
            value={form.mobileNumber}
            onChange={(value) => setForm((prev) => ({ ...prev, mobileNumber: value }))}
          />
          <Input
            label="Job title"
            value={form.jobTitle}
            onChange={(value) => setForm((prev) => ({ ...prev, jobTitle: value }))}
          />
          <Input
            label="Company"
            value={form.company}
            onChange={(value) => setForm((prev) => ({ ...prev, company: value }))}
          />

          <div className="sm:col-span-2 flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
            {isEditing ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Import registrations</h2>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/api/admin/registrations/template";
            }}
            className="rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Download Excel template
          </button>
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
            {importing ? "Importing..." : "Import + send confirmation emails"}
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
        <h2 className="text-lg font-semibold text-slate-900">Registered users</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-600">Loading registrations...</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Company</th>
                  <th className="px-2 py-2">Created</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={String(row.id)} className="border-b border-slate-100">
                    <td className="px-2 py-2">{`${row.first_name} ${row.last_name}`}</td>
                    <td className="px-2 py-2">{row.email}</td>
                    <td className="px-2 py-2">{row.company}</td>
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
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-2 py-4 text-center text-slate-500">
                      No registrations yet.
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
