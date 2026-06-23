"use client";

import { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "", studentId: "", department: "", faculty: "",
    level: "", email: "", phone: "", password: "", confirmPassword: "",
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => setForm({ ...form, [field]: value });

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
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                <input type="text" required placeholder="John Doe" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Student ID *</label>
                <input type="text" required placeholder="STU-001" value={form.studentId} onChange={(e) => updateField("studentId", e.target.value)} className="input-field" />
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
                <label className="block text-sm font-medium mb-1.5">Email *</label>
                <input type="email" required placeholder="john@school.edu" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                <input type="tel" placeholder="+234 XXX XXX XXXX" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="input-field" />
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
              <Link href="/login" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
