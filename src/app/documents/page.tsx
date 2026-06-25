"use client";

import { useState, useEffect } from "react";
import { Folder, FileText, Upload, Download, Eye } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DocumentsPage() {
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

  const docCategories = [
    { name: "Admission Letter", icon: FileText, status: "Not Uploaded" },
    { name: "Academic Transcript", icon: FileText, status: "Not Uploaded" },
    { name: "ID Card", icon: Folder, status: "Not Uploaded" },
    { name: "Passport Photograph", icon: Folder, status: "Not Uploaded" },
    { name: "O'Level Results", icon: FileText, status: "Not Uploaded" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Documents</h1>
          <p className="text-[var(--muted)] text-sm">Manage your uploaded documents</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Upload size={16} />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docCategories.map((doc, i) => {
          const Icon = doc.icon;
          return (
            <div key={i} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Icon size={20} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-[var(--muted)]">{doc.status}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 text-xs py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--background)] transition-colors flex items-center justify-center gap-1">
                  <Upload size={12} /> Upload
                </button>
                <button className="text-xs py-1.5 px-2 rounded-lg border border-[var(--border)] hover:bg-[var(--background)] transition-colors">
                  <Eye size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Folder size={18} />
          Document Guidelines
        </h3>
        <ul className="space-y-2 text-sm text-[var(--muted)]">
          <li>• Accepted formats: PDF, JPG, PNG (Max 5MB each)</li>
          <li>• Ensure all documents are clearly legible</li>
          <li>• Upload a recent passport photograph</li>
          <li>• Certified copies of academic credentials</li>
        </ul>
      </div>
    </div>
  );
}
