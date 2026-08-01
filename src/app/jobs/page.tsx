"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, ExternalLink, MapPin, Clock, DollarSign, Mail, Send, CheckCircle, Zap, Users, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import ApplyModal from "@/components/ApplyModal";
import { toast } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import PageTour from "@/components/PageTour";

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
  const { user, loading: authLoading, logout } = useAuth({ requireOnboarded: true });
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
  const [applyModalJob, setApplyModalJob] = useState<Job | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      setEmail((user as any).email || "");
    }
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
    }).catch(() => setLoading(false));
  }, [authLoading, user]);

  useEffect(() => {
    let filtered = allJobs;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.description.toLowerCase().includes(q) || j.requiredSkills?.some(s => s.toLowerCase().includes(q)));
    }
    if (cityFilter !== "all") filtered = filtered.filter(j => j.city === cityFilter);
    if (typeFilter !== "all") filtered = filtered.filter(j => j.type === typeFilter);
    setJobs(filtered);
  }, [searchQuery, cityFilter, typeFilter, allJobs]);

  const subscribe = async () => {
    if (!email.trim()) return;
    setSubscribing(true);
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (res.ok) { setSubscribed(true); toast.success("Subscribed! You'\''ll get job alerts."); }
      else { toast.error("Subscription failed"); }
    } catch { toast.error("Network error"); }
    setSubscribing(false);
  };

  const quickApply = async (jobId: string) => {
    setApplying(jobId);
    try {
      const res = await fetch("/api/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }) });
      if (res.ok) { setAppliedJobs(prev => new Set(prev).add(jobId)); toast.success("Application submitted!"); }
      else { const err = await res.json(); toast.error(err.error || "Application failed"); }
    } catch { toast.error("Network error"); }
    setApplying(null);
  };

  const applyToJob = (job: Job) => {
    if (job._isReal && job.applyUrl) {
      window.open(job.applyUrl, "_blank", "noopener,noreferrer");
      setAppliedJobs(prev => new Set(prev).add(job.id));
      toast.success("Opening the original posting to apply");
      fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, autoApply: false, jobTitle: job.title, company: job.company, location: job.location, emailContent: "" }),
      }).catch(() => {});
    } else {
      setApplyModalJob(job);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const realJobs = jobs.filter(j => j._isReal);
  const hasData = hasRealData || allJobs.length > 0;

  return (
    <ErrorBoundary>
      <div className="h-screen flex overflow-hidden">
        <Sidebar user={user} onLogout={logout} />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6" data-tour="jobs-header">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {hasRealData ? `Jobs across Tamil Nadu (${realJobCount}+ live)` : "Job Listings"}
                </h1>
                <p className="text-sm text-slate-400">{hasRealData ? "Live jobs from across Tamil Nadu matched to your skills" : "No live openings found yet"}</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {hasRealData && <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 text-green-400"><CheckCircle className="w-3 h-3" /> Live Data</span>}
                <span className="text-slate-500">{jobs.length} jobs</span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6" data-tour="jobs-filter">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, companies, skills..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500/30 transition-colors placeholder:text-slate-600"
                />
              </div>
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500/30 transition-colors">
                {CITIES.map(c => <option key={c} value={c}>{c === "all" ? "All Cities" : c}</option>)}
              </select>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500/30 transition-colors">
                {TYPES.map(t => <option key={t} value={t}>{t === "all" ? "All Types" : t}</option>)}
              </select>
            </div>

            {/* Job Cards */}
            {jobs.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-1">No matching live jobs in Tamil Nadu</h3>
                <p className="text-sm text-slate-500">Try adjusting your filters or check back later — only live openings are shown</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-tour="jobs-list">
                {jobs.map((job, i) => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    className="p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col" style={{ background: "rgba(17,17,24,0.5)" }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{job.title}</h3>
                        <p className="text-xs text-indigo-400 truncate">{job.company}</p>
                      </div>
                      {job.urgent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 shrink-0 ml-2">Urgent</span>}
                      {job._isReal && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 shrink-0 ml-2">Live</span>}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.city || job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                    </div>

                    <p className="text-xs text-slate-400 mb-3 flex-1 line-clamp-2">{job.description}</p>

                    {job.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.requiredSkills.slice(0, 3).map(s => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{s}</span>
                        ))}
                        {job.requiredSkills.length > 3 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">+{job.requiredSkills.length - 3}</span>}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-auto">
                      {job._isReal ? (
                        <button onClick={() => applyToJob(job)}
                          className="flex-1 py-2 bg-indigo-500 text-white hover:bg-indigo-400 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5">
                          <ExternalLink className="w-3 h-3" /> Apply Now
                        </button>
                      ) : (
                        <button onClick={() => setApplyModalJob(job)}
                          className="flex-1 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-xs font-medium transition-all">
                          Quick Apply
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      {applyModalJob && (
        <ApplyModal
          job={applyModalJob}
          userEmail={user?.email || ""}
          userName={user?.name || ""}
          onConfirm={async (emailContent) => {
            try {
              setApplying(applyModalJob.id);
              const res = await fetch("/api/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId: applyModalJob.id, emailContent }) });
              if (res.ok) { setAppliedJobs(prev => new Set(prev).add(applyModalJob.id)); toast.success("Application sent!"); }
              else toast.error("Application failed");
            } catch { toast.error("Network error"); }
            setApplying(null);
            setApplyModalJob(null);
          }}
          onCancel={() => setApplyModalJob(null)}
          loading={applying === applyModalJob.id}
        />
      )}
      <PageTour id="jobs" steps={[
        { target: "[data-tour='jobs-header']", title: "Live jobs across India", body: "Tamil Nadu first: live openings ranked by your profile — the count updates in real time." },
        { target: "[data-tour='jobs-filter']", title: "Search & filter", body: "Search by skill or role, and filter by city and job type to narrow your hunt." },
        { target: "[data-tour='jobs-list']", title: "Apply in one click", body: "Every card is matched to your profile. Open it for a full view and one-click apply with your AI resume." },
      ]}/>
    </ErrorBoundary>
  );
}
