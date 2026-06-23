"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Download, GraduationCap } from "lucide-react";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AcademicsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    studentId: "", courseCode: "", courseTitle: "", credits: "",
    score: "", semester: "First", academicYear: "", level: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rRes, cRes] = await Promise.all([
        fetch("/api/results"),
        fetch("/api/courses"),
      ]);
      const rData = await rRes.json();
      const cData = await cRes.json();
      if (rRes.ok) setResults(rData.results || []);
      if (cRes.ok) setCourses(cData.courses || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const updateField = (f: string, v: string) => setForm({ ...form, [f]: v });

  const openAdd = () => {
    setEditId(null);
    setForm({ studentId: "", courseCode: "", courseTitle: "", credits: "", score: "", semester: "First", academicYear: "", level: "" });
    setShowModal(true);
  };

  const openEdit = (r: any) => {
    setEditId(r._id);
    setForm({
      studentId: r.studentId, courseCode: r.courseCode, courseTitle: r.courseTitle,
      credits: String(r.credits), score: String(r.score), semester: r.semester,
      academicYear: r.academicYear, level: r.level,
    });
    setShowModal(true);
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
        body: JSON.stringify({ ...form, credits: Number(form.credits), score: Number(form.score) }),
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
    const { jsPDF } = require("jspdf");
    require("jspdf-autotable");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("ACADEMIC TRANSCRIPT", 105, 20, { align: "center" as any });
    doc.setFontSize(10);
    doc.text("EduManage University", 105, 28, { align: "center" as any });
    (doc as any).autoTable({
      head: [["Student ID", "Course", "Credits", "Score", "Grade", "Semester"]],
      body: results.map((r: any) => [r.studentId, r.courseTitle, r.credits, r.score, r.grade, r.semester]),
      startY: 35,
      theme: "striped",
    });
    doc.save("transcript.pdf");
  };

  const filtered = results.filter((r: any) =>
    r.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    r.courseCode?.toLowerCase().includes(search.toLowerCase()) ||
    r.courseTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Academic Records</h1>
          <p className="text-[var(--muted)] text-sm">Manage courses, grades, and results</p>
        </div>
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
      </div>

      <div className="card p-4">
        <div className="relative max-w-xs">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input type="text" placeholder="Search results..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 py-2 text-sm" />
        </div>
      </div>

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
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Semester</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-[var(--muted)]">No results found</td></tr>
                ) : (
                  filtered.map((r: any) => (
                    <tr key={r._id}>
                      <td className="font-medium text-sm">{r.studentId}</td>
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
                      <td>
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-amber-600"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(r._id)} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? "Edit Result" : "Add Result"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Student ID</label>
              <input type="text" required value={form.studentId} onChange={(e) => updateField("studentId", e.target.value)} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Course Code</label>
              <input type="text" required value={form.courseCode} onChange={(e) => updateField("courseCode", e.target.value)} className="input-field text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Course Title</label>
              <input type="text" required value={form.courseTitle} onChange={(e) => updateField("courseTitle", e.target.value)} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Credits</label>
              <input type="number" required min={1} max={6} value={form.credits} onChange={(e) => updateField("credits", e.target.value)} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Score</label>
              <input type="number" required min={0} max={100} value={form.score} onChange={(e) => updateField("score", e.target.value)} className="input-field text-sm" />
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
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select value={form.level} onChange={(e) => updateField("level", e.target.value)} className="input-field text-sm">
                {[100, 200, 300, 400, 500, 600, 700, 800].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full text-sm">Save Result</button>
        </form>
      </Modal>
    </div>
  );
}
