"use client";

import { useState, useEffect } from "react";
import { CreditCard, Wallet, CheckCircle, Clock, AlertCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function FeesPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    try {
      const u = JSON.parse(stored);
      fetchProfile(u.email);
    } catch {}
  }, []);

  const fetchProfile = async (email: string) => {
    try {
      const res = await fetch(`/api/dashboard/student?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok) setProfile(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const summaryCards = [
    { icon: Wallet, label: "Total Fees", value: "—", color: "indigo" },
    { icon: CheckCircle, label: "Paid", value: "—", color: "emerald" },
    { icon: Clock, label: "Outstanding", value: "—", color: "amber" },
    { icon: AlertCircle, label: "Status", value: "Not Available", color: "blue" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Fees & Payments</h1>
        <p className="text-[var(--muted)] text-sm">View your fee status and payment history</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((s, i) => {
          const Icon = s.icon;
          const colorClasses: Record<string, string> = {
            indigo: "bg-indigo-100 text-indigo-600",
            emerald: "bg-emerald-100 text-emerald-600",
            amber: "bg-amber-100 text-amber-600",
            blue: "bg-blue-100 text-blue-600",
          };
          const c = colorClasses[s.color] || "bg-gray-100 text-gray-600";
          return (
            <div key={i} className="card p-4 text-center">
              <div className={`w-10 h-10 rounded-xl ${c.split(" ")[0]} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={20} className={c.split(" ")[1]} />
              </div>
              <p className="text-xs text-[var(--muted)]">{s.label}</p>
              <p className="text-lg font-bold mt-1">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <CreditCard size={18} />
          Payment Records
        </h3>
        <div className="p-6 rounded-xl bg-[var(--background)] text-center">
          <CreditCard size={48} className="mx-auto text-[var(--muted)] mb-3 opacity-50" />
          <p className="font-medium">No payment records found</p>
          <p className="text-sm text-[var(--muted)] mt-1">
            Fee information will be available once the system is updated.
          </p>
        </div>
      </div>

      <div className="card p-4">
        <p className="text-xs text-[var(--muted)]">
          Student: {profile?.name || "—"} · {profile?.studentId || "—"} · Level: {profile?.level || "—"}
        </p>
      </div>
    </div>
  );
}
