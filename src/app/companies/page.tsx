"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, FileText, Building2, Search, Star, Users, Globe, TrendingUp, ExternalLink, MessageCircle, Briefcase, GraduationCap, GitBranch, Shield, Radar, IndianRupee, Trophy, Mic } from "lucide-react";

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
  { href: "/mock-interview", label: "Mock Interview", icon: Mic },
  { href: "/resume-builder", label: "Resume Builder", icon: FileText },
  { href: "/internships", label: "Internships", icon: Briefcase },
  { href: "/tracker", label: "Tracker", icon: Trophy },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/skills", label: "Skill Gaps", icon: Target },
];

  interface Company {
    id: string; name: string; slug: string; industry: string; headquarters: string;
    size: string; founded: number; rating: number; culture: string; benefits: string[];
    salaryRange: string; growthRate: string; techStack: string[]; description: string;
    website: string; logo: string; verified?: boolean; realLogo?: string;
  }

const GROWTH_COLORS: Record<string, string> = {
  booming: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  growing: "text-green-400 bg-green-500/10 border-green-500/20",
  stable: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  declining: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Company | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      fetch(`/api/companies?q=${search}&verify=true`).then(r => r.json()).then(c => {
        setCompanies(Array.isArray(c) ? c : []);
        setLoading(false);
      });
    });
  }, [search, router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/companies" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Company Research</h1>
          <p className="text-slate-400 text-sm mb-6">Explore top companies, their culture, benefits, and tech stacks</p>

          <div className="glass p-4 mb-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)} className="!pl-10" />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {companies.map(company => (
                <div key={company.id} className="glass p-6 glass-hover transition-all cursor-pointer" onClick={() => setSelected(selected?.id === company.id ? null : company)}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {company.realLogo ? (
                        <img src={company.realLogo} alt={company.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                      ) : null}
                      <span className={`text-2xl ${company.realLogo ? 'hidden' : ''}`}>{company.logo}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{company.name}</h3>
                        {company.verified && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">VERIFIED</span>}
                        <span className="text-xs px-1.5 py-0.5 rounded border border-white/10 text-slate-400">{company.industry}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>{company.headquarters}</span>
                        <span>{company.size} employees</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{company.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded border ${GROWTH_COLORS[company.growthRate] || "text-slate-400"}`}>{company.growthRate}</span>
                        <span className="text-xs text-slate-400">{company.salaryRange}</span>
                      </div>
                    </div>
                  </div>

                  {selected?.id === company.id && (
                    <div className="mt-4 pt-4 border-t border-white/5 animate-slide-up">
                      <p className="text-sm text-slate-400 mb-3">{company.description}</p>
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Culture</h4>
                        <p className="text-sm text-slate-300">{company.culture}</p>
                      </div>
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Tech Stack</h4>
                        <div className="flex flex-wrap gap-1.5">{company.techStack.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{t}</span>)}</div>
                      </div>
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Benefits</h4>
                        <div className="flex flex-wrap gap-1.5">{company.benefits.map(b => <span key={b} className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{b}</span>)}</div>
                      </div>
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-2">
                        <Globe className="w-3 h-3" /> Visit Website <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
