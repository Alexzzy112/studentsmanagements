"use client";

import { useState, useEffect } from "react";
import { Save, Upload, Shield, Database, Palette, Building2, Users, Key, User, Mail, GraduationCap } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string; role: string; email?: string } | null>(null);
  const [schoolInfo, setSchoolInfo] = useState({
    name: "EduManage University", address: "123 Education Street", city: "Academic City",
    state: "Learning State", country: "Nigeria", phone: "+234 XXX XXX XXXX", email: "info@edumanage.edu",
    website: "www.edumanage.edu", motto: "Excellence in Education",
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("school");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  const isStudent = user?.role === "student";

  const adminTabs = [
    { id: "school", label: "School Info", icon: Building2 },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "roles", label: "Roles & Permissions", icon: Users },
    { id: "security", label: "Security", icon: Shield },
    { id: "backup", label: "Backup", icon: Database },
  ];

  const studentTabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  const tabs = isStudent ? studentTabs : adminTabs;

  if (isStudent) {
    return (
      <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-[var(--muted)] text-sm">Manage your account settings</p>
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-[var(--background)] border border-[var(--border)] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "bg-white dark:bg-gray-800 shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "profile" && (
          <div className="card p-6 space-y-5">
            <h3 className="font-semibold">My Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input type="text" defaultValue={user?.name || ""} className="input-field" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" defaultValue={user?.email || ""} className="input-field" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Role</label>
                <input type="text" defaultValue={user?.role || ""} className="input-field capitalize" readOnly />
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="card p-6 space-y-5">
            <h3 className="font-semibold">Security</h3>
            <div className="p-4 rounded-xl bg-[var(--background)]">
              <p className="font-medium text-sm mb-2">Change Password</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="password" placeholder="Current password" className="input-field text-sm" />
                <input type="password" placeholder="New password" className="input-field text-sm" />
                <input type="password" placeholder="Confirm new password" className="input-field text-sm" />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              Update Password
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[var(--muted)] text-sm">Configure system settings and preferences</p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-[var(--background)] border border-[var(--border)] overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id ? "bg-white dark:bg-gray-800 shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "school" && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">School Information</h3>
            <div className="flex items-center gap-3">
              <label className="btn-secondary text-sm cursor-pointer flex items-center gap-2">
                <Upload size={14} />
                Upload Logo
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(schoolInfo).map(([key, val]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5 capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, [key]: e.target.value })}
                  className="input-field"
                />
              </div>
            ))}
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      )}

      {activeTab === "theme" && (
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold">Theme Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--background)]">
              <div>
                <p className="font-medium text-sm">Dark Mode</p>
                <p className="text-xs text-[var(--muted)]">Toggle dark mode on/off</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" onChange={() => {
                  const isDark = document.documentElement.classList.toggle("dark");
                  localStorage.setItem("theme", isDark ? "dark" : "light");
                }} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex gap-3">
                {["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"].map((color) => (
                  <button key={color} className="w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-300 transition-all" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm"><Save size={16} /> Save Theme</button>
        </div>
      )}

      {activeTab === "roles" && (
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold">User Roles & Permissions</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>View Students</th>
                  <th>Add Students</th>
                  <th>Edit Students</th>
                  <th>Delete Students</th>
                  <th>Manage Results</th>
                  <th>Settings</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { role: "Admin", perms: [true, true, true, true, true, true] },
                  { role: "Staff", perms: [true, true, true, false, true, false] },
                  { role: "Student", perms: [true, false, false, false, false, false] },
                ].map((r) => (
                  <tr key={r.role}>
                    <td className="font-medium">{r.role}</td>
                    {r.perms.map((p, i) => (
                      <td key={i}>
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${p ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-red-100 dark:bg-red-900/30 text-red-600"}`}>
                          {p ? "✓" : "✗"}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--background)]">
              <div>
                <p className="font-medium text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-[var(--muted)]">Add an extra layer of security</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
              </label>
            </div>
            <div className="p-4 rounded-xl bg-[var(--background)]">
              <p className="font-medium text-sm mb-2">Change Password</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="password" placeholder="Current password" className="input-field text-sm" />
                <input type="password" placeholder="New password" className="input-field text-sm" />
                <input type="password" placeholder="Confirm new password" className="input-field text-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--background)]">
              <div>
                <p className="font-medium text-sm">JWT Token Expiry</p>
                <p className="text-xs text-[var(--muted)]">Current: 7 days</p>
              </div>
              <select className="input-field py-1.5 text-sm w-32">
                <option>1 day</option>
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
              </select>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm"><Save size={16} /> Update Security</button>
        </div>
      )}

      {activeTab === "backup" && (
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold">Database Backup</h3>
          <div className="p-6 rounded-xl bg-[var(--background)] border border-dashed border-[var(--border)] text-center">
            <Database size={48} className="mx-auto text-[var(--muted)] mb-3 opacity-50" />
            <p className="font-medium">Last backup: Never</p>
            <p className="text-xs text-[var(--muted)] mt-1">Regular backups ensure your data is safe</p>
            <button className="btn-primary mt-4 flex items-center gap-2 mx-auto text-sm"><Database size={16} /> Create Backup Now</button>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
              <span className="text-sm">Auto backup every 24 hours</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
              <span className="text-sm">Keep backups for 30 days</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
