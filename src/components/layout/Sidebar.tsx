"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Building2,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const allNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["student", "staff", "admin", "hod"] },
  { href: "/students", label: "Students", icon: Users, roles: ["staff", "admin", "hod"] },
  { href: "/academics", label: "Academic Records", icon: BookOpen, roles: ["student", "staff", "admin", "hod"] },
  { href: "/departments", label: "Departments", icon: Building2, roles: ["staff", "admin", "hod"] },
  { href: "/reports", label: "Reports & Analytics", icon: BarChart3, roles: ["staff", "admin", "hod"] },
  { href: "/notifications", label: "Notifications", icon: Bell, roles: ["student", "staff", "admin", "hod"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["student", "staff", "admin", "hod"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState("student");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.role) setRole(u.role);
      } catch {}
    }
  }, []);

  const navItems = allNavItems.filter((item) => item.roles.includes(role));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white shadow-lg"
      >
        <Menu size={24} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 transition-all duration-300 flex flex-col
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          bg-[var(--sidebar)] text-[var(--sidebar-foreground)]`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className={`flex items-center gap-3 ${collapsed && "justify-center w-full"}`}>
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-sm">EduManage</h2>
                <p className="text-xs text-white/50">Student Records</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 hover:bg-white/10 rounded-lg"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? "bg-indigo-500/20 text-white font-medium"
                    : "text-white/60 hover:text-white hover:bg-[var(--sidebar-hover)]"
                  }
                  ${collapsed && "justify-center"}`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/login"; }}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-[var(--sidebar-hover)] transition-all duration-200 ${collapsed && "justify-center"}`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center p-3 border-t border-white/10 text-white/40 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>
    </>
  );
}
