"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, BookOpen, CheckCircle, XCircle, GraduationCap, Clock } from "lucide-react";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CoursesPage() {
  const [user, setUser] = useState<any>(null);

  const isAdmin = user?.role === "admin" || user?.role === "hod" || user?.role === "staff";

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
      } catch {}
    }
  }, []);

  if (!user) return <LoadingSpinner size="lg" />;

  if (isAdmin) {
    return <AdminCoursesView />;
  }

  return <StudentCoursesView user={user} />;
}

function AdminCoursesView() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    code: "", title: "", credits: "", department: "", faculty: "", level: "100", semester: "First",
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (res.ok) setCourses(data.courses || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ code: "", title: "", credits: "", department: "", faculty: "", level: "100", semester: "First" });
    setShowModal(true);
  };

  const openEdit = (c: any) => {
    setEditId(c._id);
    setForm({
      code: c.code, title: c.title, credits: String(c.credits),
      department: c.department, faculty: c.faculty, level: c.level, semester: c.semester,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const url = editId ? `/api/courses/${editId}` : "/api/courses";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, credits: Number(form.credits) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setShowModal(false);
      fetchCourses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCourses(courses.filter((c: any) => c._id !== id));
      }
    } catch {}
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Course Management</h1>
          <p className="text-[var(--muted)] text-sm">Create and manage courses</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center"><BookOpen size={20} className="text-indigo-600" /></div>
          <div><p className="text-lg font-bold">{courses.length}</p><p className="text-xs text-[var(--muted)]">Total Courses</p></div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Credits</th>
                <th>Department</th>
                <th>Level</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[var(--muted)]">No courses created yet</td></tr>
              ) : (
                courses.map((c: any) => (
                  <tr key={c._id}>
                    <td className="font-medium">{c.code}</td>
                    <td>{c.title}</td>
                    <td>{c.credits}</td>
                    <td className="text-sm text-[var(--muted)]">{c.department}</td>
                    <td><span className="badge badge-info">{c.level}</span></td>
                    <td className="text-sm">{c.semester}</td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-amber-600"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? "Edit Course" : "Add Course"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Course Code</label>
              <input type="text" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field text-sm" placeholder="e.g. CSC101" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Credits</label>
              <input type="number" required min={1} max={6} value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} className="input-field text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Course Title</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input type="text" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Faculty</label>
              <input type="text" required value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="input-field text-sm">
                {[100, 200, 300, 400, 500, 600, 700, 800].map((l) => (
                  <option key={l} value={l}>{l} Level</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Semester</label>
              <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="input-field text-sm">
                <option value="First">First</option>
                <option value="Second">Second</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full text-sm">{editId ? "Update" : "Create"} Course</button>
        </form>
      </Modal>
    </div>
  );
}

function StudentCoursesView({ user }: { user: any }) {
  const [profile, setProfile] = useState<any>(null);
  const [registered, setRegistered] = useState<any[]>([]);
  const [available, setAvailable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [availLoading, setAvailLoading] = useState(false);
  const [availSemester, setAvailSemester] = useState("First");
  const [showAvail, setShowAvail] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const pRes = await fetch(`/api/dashboard/student?email=${encodeURIComponent(user.email)}`);
      const pData = await pRes.json();
      if (pRes.ok) {
        setProfile(pData);
        if (pData.studentId) {
          const rRes = await fetch(`/api/courses/registered?studentId=${encodeURIComponent(pData.studentId)}`);
          const rData = await rRes.json();
          if (rRes.ok) setRegistered(rData.registrations || []);
        }
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const loadAvailable = async () => {
    if (!profile?.department || !profile?.level) return;
    setAvailLoading(true);
    try {
      const res = await fetch(`/api/courses?department=${encodeURIComponent(profile.department)}&level=${profile.level}&semester=${availSemester}`);
      const data = await res.json();
      if (res.ok) {
        const regCodes = new Set(registered.map((r: any) => r.courseCode));
        setAvailable((data.courses || []).filter((c: any) => !regCodes.has(c.code)));
      }
    } catch {} finally {
      setAvailLoading(false);
    }
  };

  useEffect(() => {
    if (showAvail) loadAvailable();
  }, [showAvail, availSemester, registered]);

  const handleRegister = async (courseCode: string) => {
    try {
      const res = await fetch("/api/courses/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: profile.studentId,
          courseCode,
          semester: availSemester,
          academicYear: profile.session || new Date().getFullYear() + "/" + (new Date().getFullYear() + 1),
          level: profile.level,
        }),
      });
      if (res.ok) {
        fetchAll();
        setShowAvail(false);
      } else {
        const data = await res.json();
        alert(data.error || "Registration failed");
      }
    } catch {}
  };

  const handleUnregister = async (id: string) => {
    if (!confirm("Unregister from this course?")) return;
    try {
      const res = await fetch(`/api/courses/register?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setRegistered(registered.filter((r: any) => r._id !== id));
      }
    } catch {}
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-[var(--muted)] text-sm">Register and manage your courses</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowAvail(!showAvail); if (!showAvail) loadAvailable(); }} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} />
            Register Courses
          </button>
        </div>
      </div>

      {profile && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center"><BookOpen size={20} className="text-indigo-600" /></div>
            <div><p className="text-lg font-bold">{registered.length}</p><p className="text-xs text-[var(--muted)]">Registered Courses</p></div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><GraduationCap size={20} className="text-emerald-600" /></div>
            <div><p className="text-lg font-bold">{profile.level || "—"}</p><p className="text-xs text-[var(--muted)]">Current Level</p></div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><Clock size={20} className="text-amber-600" /></div>
            <div><p className="text-lg font-bold">{profile.department || "—"}</p><p className="text-xs text-[var(--muted)]">Department</p></div>
          </div>
        </div>
      )}

      {showAvail && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Available Courses</h2>
            <select value={availSemester} onChange={(e) => setAvailSemester(e.target.value)} className="input-field py-1.5 text-sm w-32">
              <option value="First">First Semester</option>
              <option value="Second">Second Semester</option>
            </select>
          </div>
          {availLoading ? <LoadingSpinner /> : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Credits</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {available.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-[var(--muted)]">No available courses to register</td></tr>
                  ) : (
                    available.map((c: any) => (
                      <tr key={c._id}>
                        <td className="font-medium">{c.code}</td>
                        <td>{c.title}</td>
                        <td>{c.credits}</td>
                        <td>
                          <button onClick={() => handleRegister(c.code)} className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs hover:bg-indigo-700 transition-colors">
                            Register
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-[var(--border)]">
          <h2 className="font-semibold">Registered Courses</h2>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Credits</th>
                <th>Semester</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {registered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-[var(--muted)]">No courses registered yet</td></tr>
              ) : (
                registered.map((r: any) => (
                  <tr key={r._id}>
                    <td className="font-medium">{r.courseCode}</td>
                    <td>{r.course?.title || r.courseCode}</td>
                    <td>{r.course?.credits || "—"}</td>
                    <td className="text-sm text-[var(--muted)]">{r.semester}</td>
                    <td>
                      <button onClick={() => handleUnregister(r._id)} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-red-600">
                        <XCircle size={16} />
                      </button>
                    </td>
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
