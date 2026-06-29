"use client";

import { Bell, ChevronRight, LayoutDashboard, User } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const pageLabels: Record<string, string> = {
  dashboard: "Dashboard",
  students: "Students",
  add: "Add Student",
  academics: "Academic Records",
  result: "Result",
  courses: "Courses",
  hostel: "Hostel",
  fees: "Fees",
  documents: "My Documents",
  biodata: "Biodata",
  departments: "Departments",
  reports: "Reports & Analytics",
  notifications: "Notifications",
  settings: "Settings",
};

export default function Navbar() {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: pageLabels[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <header className="sticky top-0 z-30 glass border-b border-[var(--border)]">
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5">
        <nav className="flex items-center gap-1.5 text-sm min-w-0" aria-label="Breadcrumb">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[var(--border)] transition-colors text-[var(--muted)] hover:text-[var(--foreground)] flex-shrink-0"
          >
            <LayoutDashboard size={16} />
            <span className="hidden sm:inline font-medium">Dashboard</span>
          </Link>
          {breadcrumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
              <ChevronRight size={14} className="text-[var(--muted)] flex-shrink-0" />
              {crumb.isLast ? (
                <span className="font-semibold text-[var(--foreground)] truncate max-w-[120px] sm:max-w-[200px]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="px-2 py-1 rounded-lg hover:bg-[var(--border)] transition-colors text-[var(--muted)] hover:text-[var(--foreground)] truncate max-w-[120px] sm:max-w-[200px]"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/notifications" className="relative p-2 rounded-xl hover:bg-[var(--border)] transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--border)] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium hidden sm:block capitalize">{user?.name || "User"}</span>
            </button>

            {showProfile && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 card p-2 z-20 animate-scaleIn">
                  <div className="px-3 py-2 border-b border-[var(--border)]">
                    <p className="font-medium text-sm capitalize">{user?.name || "User"}</p>
                    <p className="text-xs text-[var(--muted)]">{user?.email || ""} &middot; {user?.role || ""}</p>
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setShowProfile(false)}
                    className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--border)] transition-colors mt-1"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/login"; }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--border)] transition-colors text-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
