import Link from "next/link";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

type AdminNavProps = {
  active: "dashboard" | "invitations";
};

export function AdminNav({ active }: AdminNavProps) {
  const baseLinkClass =
    "rounded px-3 py-1.5 text-sm font-medium transition hover:bg-slate-100";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-900">Siemens Admin</span>
          <nav className="flex items-center gap-1">
            <Link
              href="/admin"
              className={`${baseLinkClass} ${
                active === "dashboard"
                  ? "bg-slate-900 text-white hover:bg-slate-900"
                  : "text-slate-700"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/invitations"
              className={`${baseLinkClass} ${
                active === "invitations"
                  ? "bg-slate-900 text-white hover:bg-slate-900"
                  : "text-slate-700"
              }`}
            >
              Invitations
            </Link>
          </nav>
        </div>
        <AdminLogoutButton />
      </div>
    </header>
  );
}
