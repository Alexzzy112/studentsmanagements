"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, Award } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CoursesPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    try {
      const u = JSON.parse(stored);
      fetchCourses(u.email);
    } catch {}
  }, []);

  const fetchCourses = async (email: string) => {
    try {
      const res = await fetch(`/api/dashboard/student?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setCourses(data.courses || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold">My Courses</h1>
        <p className="text-[var(--muted)] text-sm">Courses you are currently enrolled in</p>
      </div>

      {profile && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <BookOpen size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-lg font-bold">{courses.length}</p>
              <p className="text-xs text-[var(--muted)]">Enrolled Courses</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Award size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold">{profile.completedCourses || 0}</p>
              <p className="text-xs text-[var(--muted)]">Completed</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-bold">{profile.totalCredits || 0}</p>
              <p className="text-xs text-[var(--muted)]">Total Credits</p>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        {courses.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted)]">No courses enrolled yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Credits</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c: any, i: number) => (
                  <tr key={i}>
                    <td className="font-medium">{c.code}</td>
                    <td>{c.name}</td>
                    <td>{c.credits}</td>
                    <td>{c.score || "—"}</td>
                    <td>
                      {c.grade ? (
                        <span className={`badge ${c.grade === "A" || c.grade === "B" ? "badge-success" : c.grade === "C" ? "badge-warning" : "badge-danger"}`}>
                          {c.grade}
                        </span>
                      ) : "—"}
                    </td>
                    <td>
                      <span className={`badge ${c.grade ? "badge-success" : "badge-info"}`}>
                        {c.grade ? "Completed" : "In Progress"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
