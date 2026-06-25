"use client";

import { useState, useEffect } from "react";
import { Download, GraduationCap } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    try {
      const u = JSON.parse(stored);
      fetchData(u.email);
    } catch {}
  }, []);

  const fetchData = async (email: string) => {
    try {
      const pRes = await fetch(`/api/dashboard/student?email=${encodeURIComponent(email)}`);
      const pData = await pRes.json();
      if (pRes.ok) {
        setProfile(pData);
        if (pData.studentId) {
          const rRes = await fetch(`/api/results?studentId=${encodeURIComponent(pData.studentId)}`);
          const rData = await rRes.json();
          if (rRes.ok) setResults(rData.results || []);
        }
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const generateTranscript = () => {
    const { jsPDF } = require("jspdf");
    require("jspdf-autotable");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("ACADEMIC TRANSCRIPT", 105, 20, { align: "center" as any });
    doc.setFontSize(10);
    doc.text("EduManage University", 105, 28, { align: "center" as any });
    (doc as any).autoTable({
      head: [["Course Code", "Course Title", "Credits", "Score", "Grade", "Semester"]],
      body: results.map((r: any) => [r.courseCode, r.courseTitle, r.credits, r.score, r.grade, r.semester]),
      startY: 35,
      theme: "striped",
    });
    doc.save("transcript.pdf");
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Results</h1>
          <p className="text-[var(--muted)] text-sm">View your academic performance</p>
        </div>
        <button onClick={generateTranscript} className="btn-secondary flex items-center gap-2 text-sm">
          <Download size={16} />
          Download Transcript
        </button>
      </div>

      {profile?.gpa && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-indigo-600">{profile.gpa}</p>
            <p className="text-xs text-[var(--muted)] mt-1">Current GPA</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{profile.completedCourses || 0}</p>
            <p className="text-xs text-[var(--muted)] mt-1">Completed Courses</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{profile.totalCredits || 0}</p>
            <p className="text-xs text-[var(--muted)] mt-1">Total Credits</p>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Semester</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-[var(--muted)]">No results yet</td></tr>
              ) : (
                results.map((r: any) => (
                  <tr key={r._id}>
                    <td>{r.courseCode}</td>
                    <td>{r.courseTitle}</td>
                    <td>{r.credits}</td>
                    <td>{r.score}</td>
                    <td>
                      <span className={`badge ${r.grade === "A" || r.grade === "B" ? "badge-success" : r.grade === "C" ? "badge-warning" : "badge-danger"}`}>
                        {r.grade}
                      </span>
                    </td>
                    <td className="text-sm text-[var(--muted)]">{r.semester}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
