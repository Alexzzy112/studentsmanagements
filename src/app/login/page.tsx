"use client";

import { useState } from "react";
import { Eye, EyeOff, LogIn, GraduationCap, Users, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES = [
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "staff", label: "Staff", icon: Users },
  { id: "admin", label: "Admin", icon: Shield },
] as const;

type Role = (typeof ROLES)[number]["id"];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>("student");
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md animate-fadeIn">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
              <img src="/logo.png" alt="School Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-[var(--muted)] mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const active = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500/50"
                        : "bg-[var(--border)]/30 text-[var(--muted)] hover:bg-[var(--border)]/60"
                    }`}
                  >
                    <Icon size={20} />
                    {r.label}
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                {role === "student" ? "Matric Number" : "Email"}
              </label>
              <input
                type="text"
                required
                placeholder={role === "student" ? "Enter your matric number" : "Enter your email"}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">Remember me</span>
              </label>
              <button type="button" className="text-sm text-indigo-600 hover:text-indigo-500">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>

            <p className="text-center text-sm text-[var(--muted)]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-white text-center max-w-md">
          <img src="/logo.png" alt="School Logo" className="w-24 h-24 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">EduManage</h2>
          <p className="text-lg text-indigo-200 leading-relaxed">
            A comprehensive Student Record Management System designed for modern educational institutions.
            Manage students, academics, and administrative operations seamlessly.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {["Students", "Courses", "Analytics", "Reports"].map((item) => (
              <span key={item} className="px-4 py-2 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/20">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
