"use client";

import { useState, useEffect } from "react";
import { Home, Building, Bed, Users } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function HostelPage() {
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

  const stats = [
    { icon: Building, label: "Hall of Residence", value: "N/A", color: "indigo" },
    { icon: Bed, label: "Room Number", value: "N/A", color: "emerald" },
    { icon: Users, label: "Roommates", value: "N/A", color: "amber" },
    { icon: Home, label: "Bed Space", value: "N/A", color: "blue" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Hostel Allocation</h1>
        <p className="text-[var(--muted)] text-sm">Your hostel accommodation details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-${s.color}-100 flex items-center justify-center`}>
                <Icon size={24} className={`text-${s.color}-600`} />
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Home size={18} />
          Accommodation Information
        </h3>
        <div className="p-6 rounded-xl bg-[var(--background)] text-center">
          <Home size={48} className="mx-auto text-[var(--muted)] mb-3 opacity-50" />
          <p className="font-medium">Hostel allocation details not available</p>
          <p className="text-sm text-[var(--muted)] mt-1">
            Please contact the hostel office for more information.
          </p>
        </div>
      </div>

      <div className="card p-4">
        <p className="text-xs text-[var(--muted)]">
          Student: {profile?.name || "—"} · {profile?.studentId || "—"} · {profile?.department || "—"}
        </p>
      </div>
    </div>
  );
}
