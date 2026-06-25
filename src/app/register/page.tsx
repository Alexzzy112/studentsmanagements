"use client";

import { useState } from "react";
import { Eye, EyeOff, UserPlus, Copy, Check, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState<{ studentId: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [form, setForm] = useState({
    fullName: "", department: "", faculty: "",
    level: "", email: "", phone: "", dateOfBirth: "", address: "",
    password: "", confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
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

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photo: photoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setRegistered({ studentId: data.studentId });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => setForm({ ...form, [field]: value });

  const copyId = () => {
    if (registered) {
      navigator.clipboard.writeText(registered.studentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full text-center animate-fadeIn space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <UserPlus size={28} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold">Registration Successful!</h1>
          <p className="text-[var(--muted)] text-sm">Your student ID has been generated. Save it to log in.</p>
          <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[var(--border)]/30">
            <span className="text-xl font-mono font-bold text-indigo-600">{registered.studentId}</span>
            <button onClick={copyId} className="p-2 rounded-lg hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]">
              {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
            </button>
          </div>
          <Link href="/login" className="btn-primary block text-center py-3 w-full">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-white text-center max-w-md">
          <img src="/logo.png" alt="School Logo" className="w-24 h-24 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Join EduManage</h2>
          <p className="text-lg text-indigo-200 leading-relaxed">
            Create your account to access student records, academic data, and institutional management tools.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {["Secure", "Fast", "Reliable", "Modern"].map((item) => (
              <span key={item} className="px-4 py-3 bg-white/10 rounded-xl text-sm backdrop-blur-sm border border-white/20">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div className="w-full max-w-lg animate-fadeIn py-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg mb-3">
              <UserPlus size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-[var(--muted)] mt-1">Register as a new student</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--background)] border border-dashed border-[var(--border)]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                <input type="text" required placeholder="John Doe" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="input-field" />
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
                  {[100, 200, 300, 400, 500].map((l) => (
                    <option key={l} value={l}>{l} Level</option>
                  ))}
                </select>
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
                <label className="block text-sm font-medium mb-1.5">Date of Birth</label>
                <input type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Address</label>
                <textarea rows={2} placeholder="Enter your address" value={form.address} onChange={(e) => updateField("address", e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required placeholder="Create password" value={form.password} onChange={(e) => updateField("password", e.target.value)} className="input-field pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Confirm Password *</label>
                <input type="password" required placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} className="input-field" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>

            <p className="text-center text-sm text-[var(--muted)]">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
