import { AdminNav } from "@/components/admin/admin-nav";
import { RegistrationsAdmin } from "@/components/admin/registrations-admin";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-slate-100">
      <AdminNav active="dashboard" />
      <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Review registrants, approve or reject applications, and manage approved and
          rejected lists.
        </p>
        <div className="mt-6 min-w-0">
          <RegistrationsAdmin />
        </div>
      </div>
    </main>
  );
}
