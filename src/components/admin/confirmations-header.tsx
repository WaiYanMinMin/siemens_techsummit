import { ConfirmationsLogoutButton } from "@/components/admin/confirmations-logout-button";

export function ConfirmationsHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <span className="text-sm font-bold text-slate-900">Confirmation emails</span>
          <p className="text-xs text-slate-500">
            Separate access — import ticket IDs and send Resend confirmation + QR attachment.
          </p>
        </div>
        <ConfirmationsLogoutButton />
      </div>
    </header>
  );
}
