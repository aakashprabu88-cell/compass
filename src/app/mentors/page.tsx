"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, FileText, Users, Star, MessageCircle, CheckCircle, Clock, Award, Briefcase, Building2, GraduationCap, GitBranch, Shield, Radar, IndianRupee, Trophy } from "lucide-react";

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
  { href: "/internships", label: "Internships", icon: Briefcase },
  { href: "/tracker", label: "Tracker", icon: Trophy },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/skills", label: "Skill Gaps", icon: Target },
];

interface Mentor {
  id: string; name: string; title: string; company: string; experience: number;
  skills: string[]; bio: string; available: boolean; rating: number; mentees: number;
  matchScore: number;
}

export default function MentorsPage() {
  const router = useRouter();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      fetch("/api/mentors").then(r => r.json()).then(m => {
        setMentors(Array.isArray(m) ? m : []);
        setLoading(false);
      });
    });
  }, [router]);

  const requestMentor = async (mentorId: string) => {
    setRequesting(mentorId);
    await fetch("/api/mentors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorId, message }),
    });
    setMessage("");
    setRequesting(null);
    alert("Mentor request sent!");
  };

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/mentors" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
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
          <h1 className="text-2xl font-bold mb-1">Mentor Matching</h1>
          <p className="text-slate-400 text-sm mb-6">Connect with experienced professionals in your target careers</p>

          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {mentors.map(mentor => (
                <div key={mentor.id} className="glass p-6 glass-hover transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-lg font-bold text-indigo-400 shrink-0">
                      {mentor.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{mentor.name}</h3>
                        {mentor.available && <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Available</span>}
                      </div>
                      <p className="text-sm text-slate-400">{mentor.title} at {mentor.company}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Award className="w-3 h-3" />{mentor.experience} years</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{mentor.rating}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{mentor.mentees} mentees</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {mentor.skills.slice(0, 4).map(s => <span key={s} className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{s}</span>)}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-indigo-400">{Math.round(mentor.matchScore * 100)}%</div>
                      <div className="text-[10px] text-slate-500 uppercase">match</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-3">{mentor.bio}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <input type="text" placeholder="Why do you want this mentor?" value={requesting === mentor.id ? message : ""} onChange={e => setMessage(e.target.value)}
                      className="flex-1 !text-xs !py-2" />
                    <button onClick={() => requestMentor(mentor.id)} disabled={!mentor.available || requesting === mentor.id}
                      className="px-3 py-2 text-xs bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition disabled:opacity-50">
                      {requesting === mentor.id ? "Sending..." : "Request"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
