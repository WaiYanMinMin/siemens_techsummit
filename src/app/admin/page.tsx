import { AdminNav } from "@/components/admin/admin-nav";
import { RegistrationsAdmin } from "@/components/admin/registrations-admin";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <AdminNav active="dashboard" />
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage registrations with edit/delete, filters, and bulk invitation sends.
        </p>
        <div className="mt-6">
          <RegistrationsAdmin />
        </div>
      </div>
    </main>
  );
}
