"use client";

import { useState, useEffect } from "react";
import { User, Mail, GraduationCap, Building2, BookMarked, Award, Phone, Calendar, MapPin } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function BiodataPage() {
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

  const fields = [
    { icon: User, label: "Full Name", value: profile?.name },
    { icon: Mail, label: "Email", value: profile?.email },
    { icon: GraduationCap, label: "Student ID", value: profile?.studentId },
    { icon: Building2, label: "Department", value: profile?.department },
    { icon: Building2, label: "Faculty", value: profile?.faculty },
    { icon: BookMarked, label: "Level", value: profile?.level },
    { icon: Award, label: "Status", value: profile?.status },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">My Biodata</h1>
        <p className="text-[var(--muted)] text-sm">Your personal and academic information</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[var(--border)]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <User size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold capitalize">{profile?.name || "Student"}</h2>
            <p className="text-sm text-[var(--muted)]">{profile?.studentId || "—"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Icon size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">{f.label}</p>
                  <p className="text-sm font-medium capitalize">{f.value || "—"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
