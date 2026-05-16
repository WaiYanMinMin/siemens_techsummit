"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className="rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
    >
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
