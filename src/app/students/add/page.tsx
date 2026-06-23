"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";

function AddStudentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    studentId: "", fullName: "", gender: "", dateOfBirth: "", email: "", phone: "",
    department: "", faculty: "", level: "", address: "", status: "active",
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const updateField = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let photoUrl = "";
      if (photo) {
        const uploadBody = new FormData();
        uploadBody.append("file", photo);
        uploadBody.append("folder", "students");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadBody });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Photo upload failed");
        photoUrl = uploadData.url;
      }

      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (photoUrl) body.append("photo", photoUrl);

      const url = editId ? `/api/students/${editId}` : "/api/students";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, { method, body });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save student");
      router.push("/students");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/students" className="p-2 rounded-xl hover:bg-[var(--border)] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{editId ? "Edit Student" : "Add New Student"}</h1>
          <p className="text-[var(--muted)] text-sm">{editId ? "Update student information" : "Enter the details of the new student"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">{error}</div>
        )}

        <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--background)] border border-dashed border-[var(--border)]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {photo ? (
              <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Upload size={24} className="text-indigo-500" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Passport Photograph</p>
            <p className="text-xs text-[var(--muted)]">Upload a recent passport photograph</p>
          </div>
          <label className="btn-secondary text-sm cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
            Choose File
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Student ID *</label>
            <input type="text" required placeholder="e.g., STU-2024-001" value={form.studentId} onChange={(e) => updateField("studentId", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name *</label>
            <input type="text" required placeholder="John Doe" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Gender</label>
            <select value={form.gender} onChange={(e) => updateField("gender", e.target.value)} className="input-field">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Date of Birth</label>
            <input type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email *</label>
            <input type="email" required placeholder="john@school.edu" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Phone Number</label>
            <input type="tel" placeholder="+234 XXX XXX XXXX" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Department *</label>
            <select required value={form.department} onChange={(e) => updateField("department", e.target.value)} className="input-field">
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Faculty *</label>
            <select required value={form.faculty} onChange={(e) => updateField("faculty", e.target.value)} className="input-field">
              <option value="">Select Faculty</option>
              <option value="Science">Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Arts">Arts</option>
              <option value="Social Sciences">Social Sciences</option>
              <option value="Medicine">Medicine</option>
              <option value="Education">Education</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Level *</label>
            <select required value={form.level} onChange={(e) => updateField("level", e.target.value)} className="input-field">
              <option value="">Select Level</option>
              {[100, 200, 300, 400, 500, 600, 700, 800].map((l) => (
                <option key={l} value={l}>{l} Level</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="input-field">
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
              <option value="expelled">Expelled</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Address</label>
            <textarea rows={2} placeholder="Enter address" value={form.address} onChange={(e) => updateField("address", e.target.value)} className="input-field" />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Link href="/students" className="btn-secondary text-sm">Cancel</Link>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 text-sm">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save size={16} /> {editId ? "Update Student" : "Save Student"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddStudentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>}>
      <AddStudentForm />
    </Suspense>
  );
}
