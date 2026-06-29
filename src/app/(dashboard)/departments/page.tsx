"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Building2, Users } from "lucide-react";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "", faculty: "", hod: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dRes, fRes] = await Promise.all([
        fetch("/api/departments"),
        fetch("/api/faculties"),
      ]);
      const dData = await dRes.json();
      const fData = await fRes.json();
      if (dRes.ok) setDepartments(dData.departments || []);
      if (fRes.ok) setFaculties(fData.faculties || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", code: "", faculty: "", hod: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (d: any) => {
    setEditId(d._id);
    setForm({ name: d.name, code: d.code, faculty: d.faculty, hod: d.hod || "", description: d.description || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const url = editId ? `/api/departments/${editId}` : "/api/departments";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/departments/${id}`, { method: "DELETE" });
      if (res.ok) setDepartments(departments.filter((d: any) => d._id !== id));
    } catch {}
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Department Management</h1>
          <p className="text-[var(--muted)] text-sm">Manage departments and faculties</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm w-fit">
          <Plus size={16} />
          Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <Building2 size={24} className="mx-auto text-indigo-500 mb-2" />
          <p className="text-2xl font-bold">{departments.length}</p>
          <p className="text-xs text-[var(--muted)]">Total Departments</p>
        </div>
        <div className="card p-4 text-center">
          <Users size={24} className="mx-auto text-emerald-500 mb-2" />
          <p className="text-2xl font-bold">{faculties.length}</p>
          <p className="text-xs text-[var(--muted)]">Total Faculties</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Department Name</th>
                  <th>Faculty</th>
                  <th>Head of Dept</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-[var(--muted)]">No departments found</td></tr>
                ) : (
                  departments.map((d: any) => (
                    <tr key={d._id}>
                      <td className="font-medium text-sm">{d.code}</td>
                      <td>{d.name}</td>
                      <td className="text-sm text-[var(--muted)]">{d.faculty}</td>
                      <td className="text-sm">{d.hod || "Not assigned"}</td>
                      <td>
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-amber-600"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(d._id)} className="p-1.5 rounded-lg hover:bg-[var(--border)] text-red-600"><Trash2 size={16} /></button>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? "Edit Department" : "Add Department"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-1">Department Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Code *</label>
              <input type="text" required placeholder="CS" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Faculty *</label>
              <select required value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} className="input-field text-sm">
                <option value="">Select Faculty</option>
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
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Head of Department</label>
            <input type="text" value={form.hod} onChange={(e) => setForm({ ...form, hod: e.target.value })} className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm" />
          </div>
          <button type="submit" className="btn-primary w-full text-sm">Save Department</button>
        </form>
      </Modal>
    </div>
  );
}
