"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, LogOut, LayoutDashboard, Route, Briefcase, FileText, Building2, GraduationCap, Target, TrendingUp, Shield, GitBranch, Radar, IndianRupee, Trophy, Search, MapPin, Clock, DollarSign, Star, ExternalLink, Filter, Briefcase as InternshipIcon, Zap, CheckCircle2, Globe } from "lucide-react";
import { INTERNSHIP_DATABASE, Internship, searchInternships, getInternshipsByType } from "@/lib/internships";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paths", label: "Career Paths", icon: Route },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/simulator", label: "Simulator", icon: GitBranch },
  { href: "/govt-exams", label: "Govt Exams", icon: Shield },
  { href: "/intelligence", label: "Intelligence", icon: Radar },
  { href: "/negotiation", label: "Negotiate", icon: IndianRupee },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/company-prep", label: "Company Prep", icon: Target },
  { href: "/internships", label: "Internships", icon: InternshipIcon },
  { href: "/tracker", label: "Tracker", icon: Trophy },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/skills", label: "Skill Gaps", icon: Target },
];

export default function InternshipsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "free">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      if (!d.onboarded) { router.push("/onboarding"); return; }
      setLoading(false);
    });
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const filtered = search
    ? searchInternships(search).filter(i => filter === "all" || i.type === filter)
    : filter === "paid"
      ? getInternshipsByType("paid")
      : filter === "free"
        ? getInternshipsByType("free")
        : INTERNSHIP_DATABASE;

  const stats = {
    total: INTERNSHIP_DATABASE.length,
    paid: getInternshipsByType("paid").length,
    free: getInternshipsByType("free").length,
    companies: new Set(INTERNSHIP_DATABASE.map(i => i.company)).size,
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/internships" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3"><InternshipIcon className="w-7 h-7 text-indigo-400" /> Internships</h1>
          <p className="text-slate-400 text-sm mb-6">Discover paid and free internships from top companies — FAANG, startups, and global leaders</p>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="glass p-4"><div className="text-xs text-slate-500 uppercase">Total Internships</div><div className="text-2xl font-bold text-indigo-400">{stats.total}</div></div>
            <div className="glass p-4"><div className="text-xs text-slate-500 uppercase">Paid</div><div className="text-2xl font-bold text-green-400">{stats.paid}</div></div>
            <div className="glass p-4"><div className="text-xs text-slate-500 uppercase">Free / Unpaid</div><div className="text-2xl font-bold text-yellow-400">{stats.free}</div></div>
            <div className="glass p-4"><div className="text-xs text-slate-500 uppercase">Companies</div><div className="text-2xl font-bold text-purple-400">{stats.companies}</div></div>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by company, role, skill..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none" />
            </div>
            <div className="flex gap-2">
              {(["all", "paid", "free"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? "bg-indigo-500 text-white" : "bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white"}`}>
                  {f === "free" ? "Free / Unpaid" : f === "all" ? "All" : "Paid"}
                </button>
              ))}
            </div>
          </div>

          {/* Internship Cards */}
          <div className="space-y-4">
            {filtered.length === 0 && (
              <div className="glass p-16 text-center">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No internships found</h3>
                <p className="text-sm text-slate-500">Try different search terms or filters</p>
              </div>
            )}

            {filtered.map(internship => (
              <div key={internship.id} className="glass p-5 hover:border-indigo-500/20 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                        {internship.company.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{internship.role}</h3>
                        <p className="text-sm text-slate-400">{internship.company}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${internship.type === "paid" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                        {internship.type === "paid" ? `Paid — ${internship.stipend}` : "Unpaid"}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{internship.description}</p>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{internship.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{internship.duration}</span>
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{internship.mode}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" />{internship.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <a href={internship.applyUrl} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-400 transition-all flex items-center gap-1.5">
                      Apply <ExternalLink className="w-3 h-3" />
                    </a>
                    <button onClick={() => setExpanded(expanded === internship.id ? null : internship.id)}
                      className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 text-xs font-medium hover:text-white transition-all">
                      {expanded === internship.id ? "Less" : "Details"}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expanded === internship.id && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Skills Required</h4>
                      <div className="flex flex-wrap gap-2">
                        {internship.skills.map(s => (
                          <span key={s} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-300">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Eligibility</h4>
                      <p className="text-sm text-slate-400">{internship.eligibility}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Deadline</h4>
                      <p className="text-sm text-slate-400">{internship.deadline}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {internship.tags.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-xs text-indigo-400">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
