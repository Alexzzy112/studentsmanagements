"use client";

import { useState, useEffect } from "react";
import {
  Users, GraduationCap, Building2, Landmark, UserPlus, Award,
  TrendingUp, ArrowUpRight, ArrowDownRight, Plus, FileText, BookOpen, Bell,
  User, Mail, Calendar, MapPin, BookMarked, BarChart3, Clock
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const weeklyData = [
  { name: "Mon", students: 12, newReg: 3 },
  { name: "Tue", students: 18, newReg: 5 },
  { name: "Wed", students: 15, newReg: 4 },
  { name: "Thu", students: 22, newReg: 7 },
  { name: "Fri", students: 20, newReg: 6 },
  { name: "Sat", students: 8, newReg: 2 },
  { name: "Sun", students: 5, newReg: 1 },
];

const deptData = [
  { name: "CS", value: 35 }, { name: "Math", value: 20 },
  { name: "Physics", value: 15 }, { name: "Chem", value: 12 },
  { name: "Bio", value: 10 }, { name: "Eng", value: 8 },
];

const recentActivities = [
  { action: "New student registered", user: "John Smith", time: "2 mins ago", type: "success" },
  { action: "Result updated", user: "CS 101", time: "15 mins ago", type: "info" },
  { action: "Department added", user: "Biochemistry", time: "1 hour ago", type: "info" },
  { action: "Student graduated", user: "Alice Johnson", time: "2 hours ago", type: "warning" },
  { action: "Record deleted", user: "STU-045", time: "3 hours ago", type: "error" },
];

function AdminDashboard({ user }: { user: { name: string; role: string } | null }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0, activeStudents: 0, departments: 0,
    faculties: 0, newRegistrations: 0, graduatedStudents: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (res.ok) setStats(data);
      else setStats({ totalStudents: 1250, activeStudents: 1080, departments: 24, faculties: 8, newRegistrations: 45, graduatedStudents: 120 });
    } catch {
      setStats({ totalStudents: 1250, activeStudents: 1080, departments: 24, faculties: 8, newRegistrations: 45, graduatedStudents: 120 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Students" value={stats.totalStudents} change="+12% from last month" changeType="positive" icon={Users} color="indigo" index={0} />
        <StatCard title="Active Students" value={stats.activeStudents} change="85% attendance rate" changeType="positive" icon={GraduationCap} color="emerald" index={1} />
        <StatCard title="Departments" value={stats.departments} change="+2 new this year" changeType="positive" icon={Building2} color="blue" index={2} />
        <StatCard title="Faculties" value={stats.faculties} change="Across all colleges" changeType="neutral" icon={Landmark} color="violet" index={3} />
        <StatCard title="New Registrations" value={stats.newRegistrations} change="This month" changeType="positive" icon={UserPlus} color="cyan" index={4} />
        <StatCard title="Graduated" value={stats.graduatedStudents} change="+8% from last year" changeType="positive" icon={Award} color="amber" index={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Student Growth</h3>
            <select className="text-sm border border-[var(--border)] rounded-lg px-2 py-1 bg-transparent">
              <option>This Week</option><option>This Month</option><option>This Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)", border: "1px solid var(--border)",
                    borderRadius: "12px", color: "var(--card-foreground)",
                  }}
                />
                <Bar dataKey="students" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="newReg" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-4">Department Distribution</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {deptData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {deptData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[var(--muted)]">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Activities</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-500">View All</button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-[var(--background)] transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  act.type === "success" ? "bg-emerald-100 dark:bg-emerald-900/30" :
                  act.type === "warning" ? "bg-amber-100 dark:bg-amber-900/30" :
                  act.type === "error" ? "bg-red-100 dark:bg-red-900/30" :
                  "bg-blue-100 dark:bg-blue-900/30"
                }`}>
                  {act.type === "success" ? <UserPlus size={16} className="text-emerald-600" /> :
                   act.type === "warning" ? <Award size={16} className="text-amber-600" /> :
                   act.type === "error" ? <Users size={16} className="text-red-600" /> :
                   <BookOpen size={16} className="text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{act.action}</p>
                  <p className="text-xs text-[var(--muted)]">{act.user} · {act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Quick Actions</h3>
            <span className="text-xs text-[var(--muted)]">Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: UserPlus, label: "Add Student", color: "from-indigo-500 to-indigo-600" },
              { icon: BookOpen, label: "Add Result", color: "from-emerald-500 to-emerald-600" },
              { icon: Building2, label: "Add Department", color: "from-blue-500 to-blue-600" },
              { icon: FileText, label: "Generate Report", color: "from-amber-500 to-amber-600" },
              { icon: Bell, label: "Send Notice", color: "from-violet-500 to-violet-600" },
              { icon: Users, label: "Manage Users", color: "from-rose-500 to-rose-600" },
            ].map((item, i) => (
              <button
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon size={18} className="text-white" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function StudentDashboard({ user }: { user: { name: string; role: string; email?: string } | null }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const res = await fetch(`/api/dashboard/student?email=${encodeURIComponent(user?.email || "")}`);
      const data = await res.json();
      if (res.ok) setProfile(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User size={18} />
              My Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <User size={18} className="text-indigo-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Name</p>
                  <p className="text-sm font-medium">{profile?.name || user?.name || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <Mail size={18} className="text-indigo-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Email</p>
                  <p className="text-sm font-medium">{profile?.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <GraduationCap size={18} className="text-indigo-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Student ID</p>
                  <p className="text-sm font-medium">{profile?.studentId || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <Building2 size={18} className="text-indigo-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Department</p>
                  <p className="text-sm font-medium">{profile?.department || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <BookMarked size={18} className="text-indigo-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Level</p>
                  <p className="text-sm font-medium">{profile?.level || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--background)]">
                <Award size={18} className="text-indigo-500" />
                <div>
                  <p className="text-xs text-[var(--muted)]">Status</p>
                  <p className="text-sm font-medium text-emerald-600">{profile?.status || "Active"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen size={18} />
                Enrolled Courses
              </h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-500">View All</button>
            </div>
            {profile?.courses && profile.courses.length > 0 ? (
              <div className="space-y-3">
                {profile.courses.map((course: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--background)]">
                    <div>
                      <p className="text-sm font-medium">{course.code}</p>
                      <p className="text-xs text-[var(--muted)]">{course.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      course.grade ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" :
                      "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                    }`}>
                      {course.grade || "In Progress"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">No courses enrolled yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={18} />
              My Performance
            </h3>
            <div className="text-center p-6">
              <div className="text-5xl font-bold text-indigo-600">
                {profile?.gpa || "—"}
              </div>
              <p className="text-sm text-[var(--muted)] mt-2">Current GPA</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl bg-[var(--background)]">
                <p className="text-lg font-bold text-emerald-600">{profile?.completedCourses || 0}</p>
                <p className="text-xs text-[var(--muted)]">Completed</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-[var(--background)]">
                <p className="text-lg font-bold text-amber-600">{profile?.totalCredits || 0}</p>
                <p className="text-xs text-[var(--muted)]">Total Credits</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell size={18} />
                Notifications
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { msg: "Registration for next semester opens soon", time: "2 days ago" },
                { msg: "Your result for CSC 201 has been updated", time: "1 week ago" },
              ].map((n, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--background)]">
                  <p className="text-sm">{n.msg}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; role: string; email?: string } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setReady(true);
  }, []);

  if (!ready) return <LoadingSpinner size="lg" />;

  const role = user?.role || "student";

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold capitalize">{role} Dashboard</h1>
          <p className="text-[var(--muted)] text-sm">Welcome back, {user?.name || "User"}.</p>
        </div>
        {role !== "student" && (
          <div className="flex gap-2">
            <button className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} />
              Add Student
            </button>
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <FileText size={16} />
              Export
            </button>
          </div>
        )}
      </div>

      {role === "student" ? (
        <StudentDashboard user={user} />
      ) : (
        <AdminDashboard user={user} />
      )}
    </div>
  );
}
