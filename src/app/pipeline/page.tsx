"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Plus, X, Building2, MapPin, ExternalLink, Trash2, ChevronDown } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface App {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  status: string;
  appliedAt: string;
  autoApplied: boolean;
  matchScore: number;
  notes: string;
}

const COLUMNS = [
  { id: "wishlist", label: "Wish List", color: "slate", icon: "⭐" },
  { id: "applied", label: "Applied", color: "blue", icon: "📨" },
  { id: "screening", label: "Screening", color: "yellow", icon: "🔍" },
  { id: "interview", label: "Interview", color: "purple", icon: "🎤" },
  { id: "offer", label: "Offer", color: "green", icon: "🎉" },
  { id: "rejected", label: "Rejected", color: "red", icon: "❌" },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  slate: { bg: "bg-white/[0.02]", border: "border-white/5", text: "text-slate-400", dot: "bg-slate-400" },
  blue: { bg: "bg-blue-500/[0.05]", border: "border-blue-500/20", text: "text-blue-400", dot: "bg-blue-400" },
  yellow: { bg: "bg-amber-500/[0.05]", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-400" },
  purple: { bg: "bg-purple-500/[0.05]", border: "border-purple-500/20", text: "text-purple-400", dot: "bg-purple-400" },
  green: { bg: "bg-emerald-500/[0.05]", border: "border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" },
  red: { bg: "bg-rose-500/[0.05]", border: "border-rose-500/20", text: "text-rose-400", dot: "bg-rose-400" },
};

export default function KanbanPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedApp, setDraggedApp] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/login"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/login"); return; }
        if (!data.onboarded) { router.push("/onboarding"); return; }
        setUser(data);

        const appsRes = await fetch("/api/apply").catch(() => null);
        if (appsRes && appsRes.ok) {
          const raw = await appsRes.json();
          setApps(Array.isArray(raw) ? raw : []);
        }
        setLoading(false);
      } catch { router.push("/login"); }
    }
    load();
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const moveApp = useCallback(async (appId: string, newStatus: string) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    try {
      await fetch("/api/apply", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status: newStatus }),
      });
    } catch {}
  }, []);

  const deleteApp = useCallback(async (appId: string) => {
    setApps(prev => prev.filter(a => a.id !== appId));
    try {
      await fetch("/api/apply", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId }),
      });
    } catch {}
  }, []);

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData("text/plain", appId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedApp(appId);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colId);
  };

  const handleDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData("text/plain");
    if (appId) moveApp(appId, colId);
    setDraggedApp(null);
    setDragOverCol(null);
  };

  const handleDragEnd = () => { setDraggedApp(null); setDragOverCol(null); };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-white/5 p-4 flex items-center justify-between shrink-0" style={{ background: "rgba(17,17,24,0.3)" }}>
          <div>
            <h1 className="text-lg font-bold">Application Pipeline</h1>
            <p className="text-xs text-slate-500">Drag applications between stages to update status</p>
          </div>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Job
          </button>
        </div>

        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-4 h-full min-w-max">
            {COLUMNS.map(col => {
              const colors = COLOR_MAP[col.color];
              const colApps = apps.filter(a => a.status === col.id);
              return (
                <div
                  key={col.id}
                  className={`w-72 flex flex-col rounded-xl border transition-colors ${colors.border} ${dragOverCol === col.id ? "ring-2 ring-indigo-500/30" : ""}`}
                  style={{ background: "rgba(17,17,24,0.3)" }}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDrop={(e) => handleDrop(e, col.id)}
                  onDragLeave={() => setDragOverCol(null)}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between p-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span>{col.icon}</span>
                      <span className="text-sm font-semibold">{col.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} font-medium`}>{colApps.length}</span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                    <AnimatePresence>
                      {colApps.map(app => (
                        <motion.div
                          key={app.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          draggable
                          onDragStart={(e) => handleDragStart(e as any, app.id)}
                          onDragEnd={handleDragEnd}
                          className={`p-3 rounded-lg border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] cursor-grab active:cursor-grabbing transition-all group ${draggedApp === app.id ? "opacity-50 ring-2 ring-indigo-500/30" : ""}`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <GripVertical className="w-3 h-3 text-slate-600 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{app.jobTitle}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                  <Building2 className="w-3 h-3" /> {app.company}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                  <MapPin className="w-3 h-3" /> {app.location.split(",")[0]}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              {app.autoApplied && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-medium">AUTO</span>
                              )}
                              {app.matchScore > 0 && (
                                <span className="text-[10px] text-indigo-400 font-medium">{Math.round(app.matchScore * 10)}% match</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={(e) => { e.stopPropagation(); deleteApp(app.id); }}
                                className="p-1 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Quick move dropdown */}
                          <div className="mt-2 relative">
                            <select
                              value={app.status}
                              onChange={(e) => { e.stopPropagation(); moveApp(app.id, e.target.value); }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full text-[10px] bg-white/[0.03] border border-white/5 rounded px-2 py-1 text-slate-400 appearance-none cursor-pointer hover:border-white/10 transition-colors"
                            >
                              {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                            </select>
                            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {colApps.length === 0 && (
                      <div className="text-center py-8 text-xs text-slate-600">
                        Drop jobs here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <AddJobModal onClose={() => setShowAddModal(false)} onAdd={(app) => { setApps(prev => [app, ...prev]); setShowAddModal(false); }} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AddJobModal({ onClose, onAdd }: { onClose: () => void; onAdd: (app: App) => void }) {
  const [form, setForm] = useState({ jobTitle: "", company: "", location: "", status: "wishlist", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jobTitle || !form.company) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        onAdd(data);
      }
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/10 p-6" style={{ background: "rgba(17,17,24,0.95)" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Add Job to Pipeline</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Job Title *</label>
            <input value={form.jobTitle} onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="Software Engineer" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Company *</label>
            <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="Google" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Location</label>
            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="Bangalore, India" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Stage</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors">
              {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors resize-none" placeholder="Any notes..." />
          </div>
          <button type="submit" disabled={submitting || !form.jobTitle || !form.company}
            className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white text-sm font-medium transition-colors">
            {submitting ? "Adding..." : "Add to Pipeline"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
