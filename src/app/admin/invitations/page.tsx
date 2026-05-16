import { AdminNav } from "@/components/admin/admin-nav";
import { InvitationsAdmin } from "@/components/admin/invitations-admin";

export default function AdminInvitationsPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <AdminNav active="invitations" />
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Invitation Manager</h1>
        <p className="mt-1 text-sm text-slate-600">
          Import a contact list and send the selected invitation email template.
        </p>
        <div className="mt-6">
          <InvitationsAdmin />
        </div>
      </div>
    </main>
  );
}
