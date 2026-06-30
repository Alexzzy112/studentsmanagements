"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Download, GraduationCap } from "lucide-react";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function AcademicsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; role: string; email?: string } | null>(null);
  const [form, setForm] = useState({
    studentId: "", courseCode: "", courseTitle: "", credits: "",
    ca: "", exam: "", semester: "First", academicYear: "", level: "",
  });
  const [error, setError] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentDept, setSelectedStudentDept] = useState("");

  const fetchData = async (u?: { name: string; role: string; email?: string } | null) => {
    try {
      const isStudent = u?.role === "student";
      if (isStudent) {
        const pRes = await fetch(`/api/dashboard/student?email=${encodeURIComponent(u?.email || "")}`);
        const pData = await pRes.json();
        if (pRes.ok && pData.studentId) {
          const [rRes, cRes] = await Promise.all([
            fetch(`/api/results?studentId=${encodeURIComponent(pData.studentId)}`),
            fetch("/api/courses"),
          ]);
          const rData = await rRes.json();
          const cData = await cRes.json();
          if (rRes.ok) setResults(rData.results || []);
          if (cRes.ok) setCourses(cData.courses || []);
        }
      } else {
        const [rRes, cRes, sRes] = await Promise.all([
          fetch("/api/results"),
          fetch("/api/courses"),
          fetch("/api/students?limit=1000"),
        ]);
        const rData = await rRes.json();
        const cData = await cRes.json();
        const sData = await sRes.json();
        if (rRes.ok) setResults(rData.results || []);
        if (cRes.ok) setCourses(cData.courses || []);
        if (sRes.ok) setStudents(sData.students || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    let u = null;
    if (stored) {
      try { u = JSON.parse(stored); setUser(u); } catch {}
    }
    fetchData(u);
  }, []);

  const updateField = (f: string, v: string) => setForm({ ...form, [f]: v });

  const openAdd = () => {
    setEditId(null);
    setForm({ studentId: "", courseCode: "", courseTitle: "", credits: "", ca: "", exam: "", semester: "First", academicYear: "", level: "" });
    setSelectedStudentDept("");
    setShowModal(true);
  };

  const openEdit = (r: any) => {
    setEditId(r._id);
    setForm({
      studentId: r.studentId, courseCode: r.courseCode, courseTitle: r.courseTitle,
      credits: String(r.credits), ca: String(r.ca || ""), exam: String(r.exam || ""),
      semester: r.semester, academicYear: r.academicYear, level: r.level,
    });
    setShowModal(true);
  };

  const handleStudentSelect = async (studentId: string) => {
    updateField("studentId", studentId);
    const student = students.find((s: any) => s.studentId === studentId || s._id === studentId);
    if (student) {
      setSelectedStudentDept(student.department || "");
      updateField("level", student.level || "");
      if (student.department) {
        const res = await fetch(`/api/courses?department=${encodeURIComponent(student.department)}&level=${student.level || ""}`);
        const data = await res.json();
        if (res.ok) setCourses(data.courses || []);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const url = editId ? `/api/results/${editId}` : "/api/results";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          credits: Number(form.credits),
          ca: Number(form.ca),
          exam: Number(form.exam),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/results/${id}`, { method: "DELETE" });
      if (res.ok) {
        setResults(results.filter((r: any) => r._id !== id));
      }
    } catch {}
  };

  const generateTranscript = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("ACADEMIC TRANSCRIPT", 105, 20, { align: "center" as any });
    doc.setFontSize(10);
    doc.text("EduManage University", 105, 28, { align: "center" as any });
    (doc as any).autoTable({
      head: [["Student ID", "Course", "Credits", "CA", "Exam", "Total", "Grade", "Semester"]],
      body: results.map((r: any) => [r.studentId, r.courseTitle, r.credits, r.ca || "—", r.exam || "—", r.score, r.grade, r.semester]),
      startY: 35,
      theme: "striped",
    });
    doc.save("transcript.pdf");
  };

  const isStudent = user?.role === "student";

  const filtered = results.filter((r: any) =>
    isStudent
      ? true
      : r.studentId?.toLowerCase().includes(search.toLowerCase()) ||
        r.courseCode?.toLowerCase().includes(search.toLowerCase()) ||
        r.courseTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const calcGradeBadge = (grade: string) => {
    if (grade === "A" || grade === "B") return "badge-success";
    if (grade === "C") return "badge-warning";
    return "badge-danger";
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Academic Records</h1>
          <p className="text-[var(--muted)] text-sm">{isStudent ? "View your academic results" : "Manage courses, grades, and results"}</p>
        </div>
        {!isStudent && (
          <div className="flex gap-2">
            <button onClick={generateTranscript} className="btn-secondary flex items-center gap-2 text-sm">
              <Download size={16} />
              Transcript
            </button>
            <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} />
              Add Result
            </button>
          </div>
        )}
      </div>

      {!isStudent && (
        <div className="card p-4">
          <div className="relative max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input type="text" placeholder="Search results..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 py-2 text-sm" />
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Credits</th>
                  <th>CA</th>
                  <th>Exam</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>Semester</th>
                  {!isStudent && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={isStudent ? 9 : 10} className="text-center py-12 text-[var(--muted)]">No results found</td></tr>
                ) : (
                  filtered.map((r: any) => (
                    <tr key={r._id}>
                      <td className="font-medium text-sm">{r.studentId}</td>
                      <td>{r.courseCode}</td>
                      <td>{r.courseTitle}</td>
                      <td>{r.credits}</td>
                      <td>{r.ca ?? "—"}</td>
                      <td>{r.exam ?? "—"}</td>
                      <td className="font-semibold">{r.score}</td>
                      <td>
                        <span className={`badge ${calcGradeBadge(r.grade)}`}>{r.grade}</span>
                      </td>
                      <td className="text-sm text-[var(--muted)]">{r.semester}</td>
                      {!isStudent && (
                        <td>
                          <div className="flex gap-1">
                            <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-amber-600"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(r._id)} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-red-600"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isStudent && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? "Edit Result" : "Add Result"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-red-500">{error}</div>}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <select
                  value={form.studentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  required
                  className="input-field text-sm"
                >
                  <option value="">Select student</option>
                  {students.map((s: any) => (
                    <option key={s._id} value={s.studentId}>
                      {s.studentId} — {s.fullName} ({s.department})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <select
                  value={form.courseCode}
                  onChange={(e) => {
                    const course = courses.find((c: any) => c.code === e.target.value);
                    updateField("courseCode", e.target.value);
                    if (course) {
                      updateField("courseTitle", course.title);
                      updateField("credits", String(course.credits));
                    }
                  }}
                  required
                  className="input-field text-sm"
                >
                  <option value="">Select course</option>
                  {courses.map((c: any) => (
                    <option key={c._id} value={c.code}>
                      {c.code} — {c.title} ({c.credits}cr)
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Course Title</label>
                <input type="text" required value={form.courseTitle} readOnly className="input-field text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Credits</label>
                <input type="number" required min={1} max={6} value={form.credits} readOnly className="input-field text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <input type="text" required value={form.level} readOnly className="input-field text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CA Score (0-40)</label>
                <input
                  type="number" min={0} max={40} required
                  value={form.ca}
                  onChange={(e) => updateField("ca", e.target.value)}
                  className="input-field text-sm"
                  placeholder="e.g. 30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Exam Score (0-60)</label>
                <input
                  type="number" min={0} max={60} required
                  value={form.exam}
                  onChange={(e) => updateField("exam", e.target.value)}
                  className="input-field text-sm"
                  placeholder="e.g. 55"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Semester</label>
                <select value={form.semester} onChange={(e) => updateField("semester", e.target.value)} className="input-field text-sm">
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Academic Year</label>
                <input type="text" required placeholder="2024/2025" value={form.academicYear} onChange={(e) => updateField("academicYear", e.target.value)} className="input-field text-sm" />
              </div>
            </div>
            {form.ca && form.exam && (
              <div className="p-3 rounded-xl bg-indigo-50 text-center">
                <span className="text-sm text-indigo-700 font-medium">
                  Total Score: {Number(form.ca) + Number(form.exam)} / 100
                </span>
              </div>
            )}
            <button type="submit" className="btn-primary w-full text-sm">Save Result</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
