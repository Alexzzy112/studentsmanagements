"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, Info, AlertTriangle, CheckCircle, XCircle, Trash2, Send } from "lucide-react";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "info" });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok) setNotifications(data.notifications || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        setForm({ title: "", message: "", type: "info" });
        fetchNotifications();
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) setNotifications(notifications.filter((n: any) => n._id !== id));
    } catch {}
  };

  const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
    info: { icon: Info, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
    warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
    success: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    error: { icon: XCircle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-[var(--muted)] text-sm">Manage system notifications and alerts</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm w-fit">
          <Plus size={16} />
          Send Notification
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : (
          <div>
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell size={48} className="mx-auto text-[var(--muted)] mb-3 opacity-50" />
                <p className="text-[var(--muted)]">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {notifications.map((n: any) => {
                  const cfg = typeConfig[n.type] || typeConfig.info;
                  const Icon = cfg.icon;
                  return (
                    <div key={n._id} className="flex items-start gap-4 p-4 hover:bg-[var(--background)] transition-colors">
                      <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={20} className={cfg.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{n.title}</p>
                            <p className="text-sm text-[var(--muted)] mt-0.5">{n.message}</p>
                          </div>
                          <button onClick={() => handleDelete(n._id)} className="p-1 rounded-lg hover:bg-[var(--border)] text-[var(--muted)] hover:text-red-500 flex-shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-1.5">
                          {new Date(n.createdAt).toLocaleDateString()} · {new Date(n.createdAt).toLocaleTimeString()}
                          {n.recipient !== "all" && ` · To: ${n.recipient}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Send Notification">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field text-sm" placeholder="Notification title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message *</label>
            <textarea required rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field text-sm" placeholder="Notification message" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field text-sm">
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
            <Send size={16} />
            Send Notification
          </button>
        </form>
      </Modal>
    </div>
  );
}
