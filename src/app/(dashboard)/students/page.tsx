"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Eye, Pencil, Trash2, FileText, FileSpreadsheet, AlertTriangle } from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Modal from "@/components/ui/Modal";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const perPage = 10;

  useEffect(() => {
    Promise.all([
      fetch("/api/faculties").then(r => r.json()),
      fetch("/api/departments").then(r => r.json()),
    ]).then(([fData, dData]) => {
      if (fData.faculties) setFaculties(fData.faculties);
      if (dData.departments) setDepartments(dData.departments);
    }).catch(() => {});
  }, []);

  const filteredDepts = facultyFilter
    ? departments.filter(d => d.faculty === facultyFilter)
    : departments;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(perPage) });
      if (search) params.append("search", search);
      if (facultyFilter) params.append("faculty", facultyFilter);
      if (deptFilter) params.append("department", deptFilter);
      if (levelFilter) params.append("level", levelFilter);
      const res = await fetch(`/api/students?${params}`);
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students);
        setTotalPages(data.totalPages || 1);
      }
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [search, facultyFilter, deptFilter, levelFilter, page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDeleteAll = async () => {
    setDeletingAll(true);
    try {
      const res = await fetch("/api/students/delete-all", { method: "DELETE" });
      if (res.ok) {
        setStudents([]);
        setDeleteAllModal(false);
        fetchStudents();
      }
    } catch {}
    setDeletingAll(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents(students.filter((s: any) => s._id !== id));
        setDeleteModal(null);
      }
    } catch {}
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Student Records", 14, 15);
    (doc as any).autoTable({
      head: [["ID", "Name", "Dept", "Level", "Status"]],
      body: students.map((s: any) => [s.studentId, s.fullName, s.department, s.level, s.status]),
      startY: 25,
    });
    doc.save("students.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students.map((s: any) => ({
      ID: s.studentId, Name: s.fullName, Email: s.email, Department: s.department,
      Faculty: s.faculty, Level: s.level, Status: s.status,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students.xlsx");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Management</h1>
          <p className="text-[var(--muted)] text-sm">Manage all student records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setDeleteAllModal(true)} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 transition-colors flex items-center gap-2">
            <Trash2 size={16} />
            Delete All
          </button>
          <Link href="/students/add" className="btn-primary flex items-center gap-2 text-sm w-fit">
            <Plus size={16} />
            Add New Student
          </Link>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full md:w-auto flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text" placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-field pl-10 py-2 text-sm"
              />
            </div>
            <select value={facultyFilter} onChange={(e) => { setFacultyFilter(e.target.value); setDeptFilter(""); setPage(1); }} className="input-field py-2 text-sm min-w-[140px]">
              <option value="">All Faculties</option>
              {faculties.map((f: any) => (
                <option key={f._id} value={f.name}>{f.name}</option>
              ))}
              {faculties.length === 0 && (
                <>
                  <option value="Science">Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Arts">Arts</option>
                  <option value="Social Sciences">Social Sciences</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Education">Education</option>
                </>
              )}
            </select>
            <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }} className="input-field py-2 text-sm min-w-[140px]">
              <option value="">All Departments</option>
              {filteredDepts.map((d: any) => (
                <option key={d._id || d.name} value={d.name}>{d.name}</option>
              ))}
              {filteredDepts.length === 0 && !facultyFilter && (
                <>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Engineering">Engineering</option>
                </>
              )}
            </select>
            <select value={levelFilter} onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }} className="input-field py-2 text-sm min-w-[120px]">
              <option value="">All Levels</option>
              {[100, 200, 300, 400, 500, 600, 700, 800].map((l) => (
                <option key={l} value={l}>{l} Level</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={exportPDF} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
              <FileText size={14} /> PDF
            </button>
            <button onClick={exportExcel} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
              <FileSpreadsheet size={14} /> Excel
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Photo</th>
                    <th>Full Name</th>
                    <th>Department</th>
                    <th>Level</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-[var(--muted)]">No students found</td>
                    </tr>
                  ) : (
                    students.map((student: any) => (
                      <tr key={student._id}>
                        <td className="font-medium text-sm">{student.studentId}</td>
                        <td>
                          {student.photo ? (
                            <img src={student.photo} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-[var(--border)]" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                              {student.fullName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td className="font-medium">{student.fullName}</td>
                        <td className="text-sm text-[var(--muted)]">{student.department}</td>
                        <td>
                          <span className="badge badge-info">{student.level}</span>
                        </td>
                        <td>
                          <span className={`badge ${student.status === "active" ? "badge-success" : student.status === "graduated" ? "badge-warning" : "badge-danger"}`}>
                            {student.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <Link href={`/students/${student._id}`} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-blue-600 transition-colors">
                              <Eye size={16} />
                            </Link>
                            <Link href={`/students/add?id=${student._id}`} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-amber-600 transition-colors">
                              <Pencil size={16} />
                            </Link>
                            <button onClick={() => setDeleteModal(student._id)} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-red-600 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
                <span className="text-sm text-[var(--muted)]">Page {page} of {totalPages}</span>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        p === page ? "bg-indigo-600 text-white" : "hover:bg-[var(--border)]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirm Delete">
        <p className="text-[var(--muted)] mb-4">Are you sure you want to delete this student? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteModal(null)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={() => deleteModal && handleDelete(deleteModal)} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 transition-colors">
            Delete
          </button>
        </div>
      </Modal>

      <Modal isOpen={deleteAllModal} onClose={() => setDeleteAllModal(false)} title="Delete All Students">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-red-50 border border-red-200">
          <AlertTriangle size={24} className="text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">
            This will permanently delete <strong>all student records and accounts</strong>. This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteAllModal(false)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleDeleteAll} disabled={deletingAll} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2">
            {deletingAll ? "Deleting..." : "Delete All Students"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
