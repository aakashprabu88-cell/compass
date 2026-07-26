"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, Briefcase, ExternalLink, MapPin, Clock, DollarSign, Mail, Send, CheckCircle, Search, Upload, GraduationCap, FileText, Zap, Users, MessageCircle, Building2, GitBranch, Shield, Radar, IndianRupee, Trophy, Mic } from "lucide-react";
import ApplyModal from "@/components/ApplyModal";

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

interface Job {
  id: string; title: string; company: string; location: string; city: string;
  type: string; salary: string; requiredSkills: string[]; description: string;
  url: string; applyUrl: string; postedDaysAgo: number; experience: string;
  education: string; openings: number; urgent: boolean; matchScore?: number;
  companyLogo?: string; _isReal?: boolean;
}

const CITIES = ["all", "Chennai", "Coimbatore", "Madurai", "Salem", "Trichy", "Vellore", "Tirunelveli", "Erode", "Remote"];
const TYPES = ["all", "full-time", "part-time", "internship", "remote", "contract"];

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [hasRealData, setHasRealData] = useState(false);
  const [realJobCount, setRealJobCount] = useState(0);
  const [atsScores, setAtsScores] = useState<Record<string, number>>({});
  const [salaryInfo, setSalaryInfo] = useState<Record<string, { min: number; max: number; median: number }>>({});
  const [expandedAts, setExpandedAts] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [applyModalJob, setApplyModalJob] = useState<Job | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      if (!d.onboarded) { router.push("/onboarding"); return; }
      setEmail(d.email || "");
      setUser({ name: d.name || "Applicant", email: d.email || "" });
    });
    Promise.all([
      fetch("/api/jobs").then(r => r.json()),
      fetch("/api/apply").then(r => r.json()),
    ]).then(([jobsData, appsData]) => {
      const d = jobsData || {};
      const real = Array.isArray(d.realJobs) ? d.realJobs.map((j: any) => ({ ...j, _isReal: true })) : [];
      const fallback = Array.isArray(d.fallbackJobs) ? d.fallbackJobs : [];
      const all = [...real, ...fallback];
      setAllJobs(all);
      setJobs(all);
      setHasRealData(!!d.hasRealData);
      setRealJobCount(d.totalRealJobs || 0);
      if (Array.isArray(appsData)) {
        setAppliedJobs(new Set(appsData.map((a: any) => a.jobId)));
      }
      setLoading(false);
      // Fetch ATS scores for top 5 jobs
      const topJobs = [...real, ...fallback].slice(0, 5);
      topJobs.forEach((j: any) => {
        fetch("/api/ats-score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId: j.id }) })
          .then(r => r.json()).then(d => { if (d.score !== undefined) setAtsScores(prev => ({ ...prev, [j.id]: d.score })); }).catch(() => {});
      });
    });
  }, [router]);

  useEffect(() => {
    let filtered = allJobs;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(j =>
        `${j.title} ${j.company} ${j.description} ${j.requiredSkills.join(" ")}`.toLowerCase().includes(q)
      );
    }
    if (cityFilter !== "all") filtered = filtered.filter(j => j.city === cityFilter);
    if (typeFilter !== "all") filtered = filtered.filter(j => j.type === typeFilter);
    setJobs(filtered);
  }, [searchQuery, cityFilter, typeFilter, allJobs]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const subscribe = async () => {
    if (!email) return;
    setSubscribing(true);
    await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setSubscribed(true);
    setSubscribing(false);
  };

  const applyToJob = async (job: Job, emailContent?: string) => {
    setApplying(job.id);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, applicantEmail: email, emailContent }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedJobs(prev => new Set([...prev, job.id]));
        if (job.applyUrl && job.applyUrl !== "#") window.open(job.applyUrl, "_blank");
      } else if (data.warning) {
        alert(`Warning: ${data.warning}`);
        setAppliedJobs(prev => new Set([...prev, job.id]));
        if (job.applyUrl && job.applyUrl !== "#") window.open(job.applyUrl, "_blank");
      }
    } catch {}
    setApplying(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const tamilNaduJobs = allJobs.filter(j => j.city !== "Remote");
  const remoteJobs = allJobs.filter(j => j.city === "Remote");
  const liveJobs = allJobs.filter(j => j._isReal);

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/jobs" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
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
          <h1 className="text-2xl font-bold mb-1">Job Search — Tamil Nadu</h1>
          <p className="text-slate-400 text-sm mb-6">
            {hasRealData ? (
              <>🔗 <span className="text-green-400 font-medium">{realJobCount} live jobs</span> from Adzuna + {allJobs.length - liveJobs.length} cached matches. Search, filter, and apply instantly.</>
            ) : (
              <>{allJobs.length} jobs across {CITIES.length - 1} cities. Search, filter, and apply instantly.</>
            )}
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Tamil Nadu Jobs", value: tamilNaduJobs.length, icon: MapPin, color: "indigo" },
              { label: "Remote Jobs", value: remoteJobs.length, icon: ExternalLink, color: "purple" },
              { label: "Urgent Hiring", value: allJobs.filter(j => j.urgent).length, icon: Zap, color: "red" },
              { label: "Applied", value: appliedJobs.size, icon: CheckCircle, color: "green" },
            ].map(s => (
              <div key={s.label} className="glass p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-${s.color}-500/10 flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 text-${s.color}-400`} />
                </div>
                <div>
                  <div className="text-lg font-bold">{s.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Email Alert Banner */}
          <div className="glass p-4 mb-6 flex items-center gap-4">
            <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Get Email Alerts for New Jobs</h3>
              <p className="text-xs text-slate-400">We&apos;ll notify you when new matching positions are posted in Tamil Nadu.</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-green-400 text-sm"><CheckCircle className="w-4 h-4" /> Subscribed!</div>
            ) : (
              <div className="flex gap-2">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="!w-56 !py-2 !text-sm" />
                <button onClick={subscribe} disabled={subscribing || !email}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400 transition-all disabled:opacity-50">
                  <Send className="w-3.5 h-3.5" /> {subscribing ? "..." : "Subscribe"}
                </button>
              </div>
            )}
          </div>

          {/* Search + Filters */}
          <div className="glass p-4 mb-6">
            <div className="flex gap-3 mb-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, skills, companies..."
                  className="!pl-10 !py-2.5 !text-sm" />
              </div>
              <Link href="/upload-resume" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm font-medium hover:bg-purple-500/20 transition-all shrink-0">
                <Zap className="w-4 h-4" /> Auto-Apply
              </Link>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Location</label>
                <div className="flex gap-1.5 flex-wrap">
                  {CITIES.map(c => (
                    <button key={c} onClick={() => setCityFilter(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-all ${cityFilter === c ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
                      {c === "all" ? "All Cities" : c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Type</label>
                <div className="flex gap-1.5 flex-wrap">
                  {TYPES.map(t => (
                    <button key={t} onClick={() => setTypeFilter(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-all ${typeFilter === t ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
                      {t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-400">Showing <strong className="text-white">{jobs.length}</strong> jobs</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users className="w-3 h-3" /> Tamil Nadu + Remote
            </div>
          </div>

          {/* Job Listings */}
          {jobs.length === 0 ? (
            <div className="glass p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-1">No jobs match your filters</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job, idx) => {
                const isApplied = appliedJobs.has(job.id);
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                    className="glass p-5 glass-hover transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{job.title}</h3>
                          {job._isReal && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">LIVE</span>}
                          {job.urgent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">URGENT</span>}
                        </div>
                        <p className="text-xs text-indigo-400">{job.company}</p>
                      </div>
                      {job.matchScore !== undefined && (
                        <div className="text-right shrink-0 ml-4">
                          <div className="text-lg font-bold text-indigo-400">{Math.round(job.matchScore * 10)}%</div>
                          <div className="text-[10px] text-slate-500 uppercase">match</div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{job.description}</p>
                    <div className="flex items-center gap-3 mb-3 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary}</span>
                      {job._isReal ? (
                        <span className="flex items-center gap-1 text-green-400"><Clock className="w-3 h-3" />Live listing</span>
                      ) : (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.postedDaysAgo}d ago</span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">{job.type}</span>
                      <span className="text-slate-600">Exp: {job.experience}</span>
                      {job._isReal && job.companyLogo && <img src={job.companyLogo} alt="" className="w-5 h-5 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.requiredSkills.map(s => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{s}</span>
                      ))}
                    </div>
                    {atsScores[job.id] !== undefined && (
                      <div className="flex items-center gap-3 mb-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${atsScores[job.id] >= 70 ? "bg-green-500/10 text-green-400" : atsScores[job.id] >= 40 ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"}`}>
                          {atsScores[job.id]}
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase">ATS Score</div>
                          <div className="text-xs text-slate-400">{atsScores[job.id] >= 70 ? "Strong match — apply now" : atsScores[job.id] >= 40 ? "Moderate match — tailor your resume" : "Low match — consider upskilling"}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      {isApplied ? (
                        <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-sm">
                          <CheckCircle className="w-3.5 h-3.5" /> Applied
                        </span>
                      ) : (
                        <button onClick={() => setApplyModalJob(job)} disabled={applying === job.id}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400 transition-all disabled:opacity-50">
                          {applying === job.id ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                          {applying === job.id ? "Applying..." : "Apply Now"}
                        </button>
                      )}
                      <a href={job.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white text-sm transition-all">
                        <ExternalLink className="w-3.5 h-3.5" /> Company Page
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {applyModalJob && user && (
        <ApplyModal
          job={applyModalJob}
          userEmail={user.email}
          userName={user.name}
          onConfirm={(emailContent) => { applyToJob(applyModalJob, emailContent); setApplyModalJob(null); }}
          onCancel={() => setApplyModalJob(null)}
          loading={applying === applyModalJob.id}
        />
      )}
    </div>
  );
}
