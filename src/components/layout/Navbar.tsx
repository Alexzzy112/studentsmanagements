"use client";

import { Bell, Search, Moon, Sun, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    if (localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const isDark = !dark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-30 glass border-b border-[var(--border)]">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search students, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl hover:bg-[var(--border)] transition-colors"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="relative p-2 rounded-xl hover:bg-[var(--border)] transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>

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
                    <p className="text-xs text-[var(--muted)]">{user?.email || ""} · {user?.role || ""}</p>
                  </div>
                  <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--border)] transition-colors mt-1">
                    Profile Settings
                  </button>
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
