"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, MapPin, Clock, DollarSign, Briefcase, Star, Zap,
  ExternalLink, CheckCircle, XCircle, ChevronDown, TrendingUp, Users,
  Target, Brain, BookOpen, ArrowRight, X, Loader2, Bookmark, Send,
  Award, Shield, Eye, Calendar, Building2, GraduationCap, Sparkles,
  ChevronLeft, BarChart3, AlertTriangle, FileText, Mail
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { toast } from "@/components/Toast";
import PageTour from "@/components/PageTour";

interface Internship {
  id: string; title: string; company: string; companyLogo: string;
  location: string; city: string; country: string; type: string;
  stipend: string; stipendMin: number; stipendMax: number; currency: string;
  duration: string; durationWeeks: number; workMode: string; domain: string;
  description: string; skillsRequired: string; applyUrl: string;
  deadline: string | null; startDate: string | null; openings: number; isPPO: boolean;
  isCertified: boolean; difficulty: string; acceptanceRate: number;
  competitionLevel: string; companyRating: number; internshipRating: number;
  mentorAvailable: boolean; lorAvailable: boolean; category: string;
  hiringSpeed: string; techStack: string; interviewRounds: number;
  userStatus: string | null; userMatchScore: number | null;
  _isLive?: boolean;
}

interface MatchResult {
  matchScore: number; skillMatch: number; domainMatch: number;
  selectionProbability: number; resumeReadiness: number;
  matchedSkills: string[]; missingSkills: string[];
  totalLearningDays: number;
  roadmap: { skill: string; week: number; hours: number; resources: string[] }[];
  internship: any;
}

const DOMAINS = ["All", "Full Stack", "Frontend", "Backend", "AI/ML", "Data Science", "DevOps", "Mobile", "Cloud", "Cybersecurity", "Blockchain", "UI/UX", "QA", "Research", "Open Source"];
const WORK_MODES = ["All", "remote", "hybrid", "onsite"];
const TYPES = ["All", "paid", "unpaid", "stipend"];
const DIFFICULTIES = ["All", "easy", "medium", "hard"];
const CATEGORIES = ["All", "tech", "startup", "fortune500", "government", "research"];
const COMPANIES = ["All", "Google", "Microsoft", "Amazon", "Apple", "NVIDIA", "Meta", "Adobe", "Atlassian", "Uber", "Zoho", "Freshworks", "Razorpay", "CRED", "Flipkart", "TCS", "Infosys", "Wipro", "Cognizant", "Deloitte", "Accenture"];

export default function InternshipsPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [workModeFilter, setWorkModeFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [sortBy, setSortBy] = useState("match");
  const [showFilters, setShowFilters] = useState(false);

  // Detail modal
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [matching, setMatching] = useState(false);

  // Tracker
  const [showTracker, setShowTracker] = useState(false);
  const [trackerData, setTrackerData] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    async function load() {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (domainFilter !== "All") params.set("domain", domainFilter);
        if (workModeFilter !== "All") params.set("workMode", workModeFilter);
        if (typeFilter !== "All") params.set("type", typeFilter);
        if (difficultyFilter !== "All") params.set("difficulty", difficultyFilter);
        if (categoryFilter !== "All") params.set("category", categoryFilter);
        if (companyFilter !== "All") params.set("company", companyFilter);
        params.set("sort", sortBy);

        const res = await fetch(`/api/internships?${params.toString()}`);
        let seeded: Internship[] = [];
        if (res.ok) {
          const data = await res.json();
          seeded = Array.isArray(data) ? data : [];
        }

        let live: Internship[] = [];
        try {
          const liveRes = await fetch("/api/internships/live");
          if (liveRes.ok) {
            const liveData = await liveRes.json();
            live = (Array.isArray(liveData.internships) ? liveData.internships : []).map((i: any) => ({
              ...i, _isLive: true,
            }));
          }
        } catch {}

        if (!cancelled) setInternships([...live, ...seeded]);
      } catch (e) { console.error("internships load", e); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [authLoading, searchQuery, domainFilter, workModeFilter, typeFilter, difficultyFilter, categoryFilter, companyFilter, sortBy]);

  const analyzeMatch = async (internship: Internship) => {
    setSelectedInternship(internship);
    setMatching(true);
    setMatchResult(null);
    try {
      const res = await fetch("/api/internships/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internshipId: internship.id }),
      });
      if (res.ok) setMatchResult(await res.json());
    } catch {}
    setMatching(false);
  };

  const applyToInternship = async (internship: Internship) => {
    if (internship._isLive) {
      if (internship.applyUrl) window.open(internship.applyUrl, "_blank", "noopener,noreferrer");
      toast.success("Opening the live internship posting to apply");
      return;
    }
    try {
      const res = await fetch("/api/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internshipId: internship.id, status: "applied" }),
      });
      if (res.ok) {
        toast.success("Application tracked! Good luck!");
        setInternships(prev => prev.map(i => i.id === internship.id ? { ...i, userStatus: "applied" } : i));
      }
    } catch { toast.error("Failed to track application"); }
  };

  const saveInternship = async (internshipId: string) => {
    try {
      const res = await fetch("/api/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internshipId, status: "saved" }),
      });
      if (res.ok) {
        toast.success("Saved to watchlist");
        setInternships(prev => prev.map(i => i.id === internshipId ? { ...i, userStatus: "saved" } : i));
      }
    } catch { toast.error("Failed to save"); }
  };

  const loadTracker = async () => {
    setShowTracker(true);
    try {
      const res = await fetch("/api/internships/tracker");
      if (res.ok) setTrackerData(await res.json());
    } catch {}
  };

  const getDaysUntilDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getDifficultyColor = (d: string) => d === "easy" ? "text-green-400 bg-green-500/10" : d === "hard" ? "text-red-400 bg-red-500/10" : "text-amber-400 bg-amber-500/10";
  const getCompetitionColor = (c: string) => c === "extreme" ? "text-red-400" : c === "high" ? "text-amber-400" : c === "low" ? "text-green-400" : "text-slate-400";

  if (loading) return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="h-8 w-64 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-4 w-96 bg-white/5 rounded animate-pulse" />
          <div className="grid grid-cols-3 gap-4 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-white/[0.02] rounded-2xl border border-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="h-screen flex overflow-hidden">
        <Sidebar user={user} onLogout={logout} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6" data-tour="internships-header">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-indigo-400" />
                    </div>
                    Internship Intelligence
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">Live internships from across Tamil Nadu, plus curated opportunities from FAANG, startups, and research labs — all matched to your skills</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/email-campaign"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/25 text-sm text-emerald-400 hover:from-emerald-500/25 hover:to-teal-500/25 transition-colors">
                    <Mail className="w-4 h-4" /> Email Outreach
                  </Link>
                  <button onClick={loadTracker}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-400 hover:text-white transition-colors">
                    <BarChart3 className="w-4 h-4" /> Tracker
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {[
                  { label: "Total Internships", value: internships.length, icon: Briefcase, color: "indigo" },
                  { label: "Paid Opportunities", value: internships.filter(i => i.type === "paid").length, icon: DollarSign, color: "green" },
                  { label: "Remote Available", value: internships.filter(i => i.workMode === "remote").length, icon: MapPin, color: "purple" },
                  { label: "High PPO Chance", value: internships.filter(i => i.isPPO).length, icon: Award, color: "amber" },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-${s.color}-500/10 flex items-center justify-center`}>
                      <s.icon className={`w-4 h-4 text-${s.color}-400`} />
                    </div>
                    <div>
                      <div className="text-lg font-bold">{s.value}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{s.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Search + Sort */}
            <div className="flex gap-3 mb-4" data-tour="internships-search">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by title, company, skill, or domain..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-colors ${showFilters ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"}`}>
                <Filter className="w-4 h-4" /> Filters
              </button>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-400 focus:outline-none cursor-pointer">
                <option value="match">Best Match</option>
                <option value="stipend">Highest Stipend</option>
                <option value="deadline">Deadline Soon</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-4">
                  <div className="glass p-4 space-y-3">
                    <FilterRow label="Domain" options={DOMAINS} selected={domainFilter} onSelect={setDomainFilter} />
                    <FilterRow label="Work Mode" options={WORK_MODES} selected={workModeFilter} onSelect={setWorkModeFilter} displayMap={{ remote: "Remote", hybrid: "Hybrid", onsite: "Onsite" }} />
                    <FilterRow label="Type" options={TYPES} selected={typeFilter} onSelect={setTypeFilter} displayMap={{ paid: "Paid", unpaid: "Unpaid", stipend: "Stipend" }} />
                    <FilterRow label="Difficulty" options={DIFFICULTIES} selected={difficultyFilter} onSelect={setDifficultyFilter} />
                    <FilterRow label="Category" options={CATEGORIES} selected={categoryFilter} onSelect={setCategoryFilter} displayMap={{ tech: "Tech", startup: "Startup", fortune500: "Fortune 500", government: "Government", research: "Research" }} />
                    <FilterRow label="Company" options={COMPANIES} selected={companyFilter} onSelect={setCompanyFilter} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results count */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-400">Showing <strong className="text-white">{internships.length}</strong> internships</p>
              <div className="flex items-center gap-2">
                {workModeFilter !== "All" && <FilterChip label={workModeFilter} onRemove={() => setWorkModeFilter("All")} />}
                {domainFilter !== "All" && <FilterChip label={domainFilter} onRemove={() => setDomainFilter("All")} />}
                {difficultyFilter !== "All" && <FilterChip label={difficultyFilter} onRemove={() => setDifficultyFilter("All")} />}
              </div>
            </div>

            {/* Internship Cards Grid */}
            {internships.length === 0 ? (
              <div className="glass p-16 text-center">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-1">No internships match your filters</h3>
                <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" data-tour="internships-list">
                {internships.map((internship, idx) => (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    index={idx}
                    onAnalyze={() => analyzeMatch(internship)}
                    onApply={() => applyToInternship(internship)}
                    onSave={() => saveInternship(internship.id)}
                    onEmail={() => router.push(`/email-campaign?company=${encodeURIComponent(internship.company)}&role=${encodeURIComponent(internship.title)}`)}
                    onSelect={() => setSelectedInternship(internship)}
                    getDaysUntilDeadline={getDaysUntilDeadline}
                    getDifficultyColor={getDifficultyColor}
                    getCompetitionColor={getCompetitionColor}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedInternship && (
            <DetailModal
              internship={selectedInternship}
              matchResult={matchResult}
              matching={matching}
              onClose={() => { setSelectedInternship(null); setMatchResult(null); }}
              onApply={() => { applyToInternship(selectedInternship); setSelectedInternship(null); }}
              onAnalyze={() => analyzeMatch(selectedInternship)}
              getDaysUntilDeadline={getDaysUntilDeadline}
              getDifficultyColor={getDifficultyColor}
            />
          )}
        </AnimatePresence>

        {/* Tracker Modal */}
        <AnimatePresence>
          {showTracker && (
            <TrackerModal
              data={trackerData}
              onClose={() => setShowTracker(false)}
            />
          )}
        </AnimatePresence>

        <PageTour id="internships" steps={[
          { target: "[data-tour='internships-header']", title: "Internship Intelligence", body: "Live internships from real boards, matched to your skills — track them straight from here." },
          { target: "[data-tour='internships-search']", title: "Search, filter, sort", body: "Filter by domain, work mode and type, then sort by match, stipend or date." },
          { target: "[data-tour='internships-list']", title: "Your shortlist", body: "Save internships, open details, and send a tailored AI outreach email for each one." },
        ]}/>
      </div>
    </ErrorBoundary>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────

function FilterRow({ label, options, selected, onSelect, displayMap }: {
  label: string; options: string[]; selected: string; onSelect: (v: string) => void; displayMap?: Record<string, string>;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-slate-500 uppercase tracking-wider w-20 shrink-0">{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        {options.map(opt => (
          <button key={opt} onClick={() => onSelect(opt)}
            className={`px-2.5 py-1 rounded-lg text-xs transition-all ${selected === opt ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
            {opt === "All" ? "All" : displayMap?.[opt] || opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-xs">
      {label} <button onClick={onRemove}><X className="w-3 h-3" /></button>
    </span>
  );
}

function InternshipCard({ internship, index, onAnalyze, onApply, onSave, onEmail, onSelect, getDaysUntilDeadline, getDifficultyColor, getCompetitionColor }: {
  internship: Internship; index: number; onAnalyze: () => void; onApply: () => void; onSave: () => void; onEmail: () => void; onSelect: () => void;
  getDaysUntilDeadline: (d: string | null) => number | null; getDifficultyColor: (d: string) => string; getCompetitionColor: (c: string) => string;
}) {
  const skills = JSON.parse(internship.skillsRequired || "[]");
  const daysLeft = getDaysUntilDeadline(internship.deadline);
  const isApplied = internship.userStatus === "applied";
  const isSaved = internship.userStatus === "saved";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      className="glass p-5 glass-hover transition-all group cursor-pointer relative overflow-hidden"
      onClick={onSelect}
    >
      {/* Urgency badge */}
      {internship._isLive && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
        </div>
      )}
      {daysLeft !== null && daysLeft <= 7 && daysLeft > 0 && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold animate-pulse">
          {daysLeft}d left
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {internship.companyLogo ? (
          <img src={internship.companyLogo} alt="" className="w-10 h-10 rounded-lg object-contain bg-white/5 p-1"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold text-indigo-400">
            {internship.company[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{internship.title}</div>
          <div className="text-xs text-indigo-400">{internship.company}</div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{internship.city}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{internship.duration}</span>
        <span className="flex items-center gap-1">
          {internship.workMode === "remote" ? "🌐" : internship.workMode === "hybrid" ? "🏠" : "🏢"}
          {internship.workMode}
        </span>
      </div>

      {/* Stipend + Type */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm font-bold text-green-400">{internship.stipend || "Unpaid"}</span>
        {internship.isPPO && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">PPO</span>
        )}
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${getDifficultyColor(internship.difficulty)}`}>
          {internship.difficulty}
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {skills.slice(0, 4).map((s: string) => (
          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{s}</span>
        ))}
        {skills.length > 4 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">+{skills.length - 4}</span>}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{internship.companyRating}</span>
          <span className={getCompetitionColor(internship.competitionLevel)}>
            {internship.competitionLevel === "extreme" ? "🔥" : internship.competitionLevel === "high" ? "⚡" : ""} {internship.competitionLevel}
          </span>
          <span>{internship.openings} slots</span>
        </div>
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          {!internship._isLive && (
            <>
              <button onClick={onSave} className={`p-1.5 rounded-lg transition-colors ${isSaved ? "bg-amber-500/10 text-amber-400" : "text-slate-500 hover:text-amber-400 hover:bg-amber-500/5"}`}>
                <Bookmark className="w-3.5 h-3.5" fill={isSaved ? "currentColor" : "none"} />
              </button>
              <button onClick={onAnalyze}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/5 transition-colors">
                <Brain className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {isApplied ? (
            <span className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Applied
            </span>
          ) : (
            <>
              {internship._isLive && (
                <button onClick={onEmail}
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:text-emerald-400 hover:border-emerald-500/30 transition-colors flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </button>
              )}
              <button onClick={onApply}
                className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-400 transition-colors flex items-center gap-1">
                {internship._isLive ? <><ExternalLink className="w-3 h-3" /> Apply Now</> : "Apply"}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DetailModal({ internship, matchResult, matching, onClose, onApply, onAnalyze, getDaysUntilDeadline, getDifficultyColor }: {
  internship: Internship; matchResult: MatchResult | null; matching: boolean;
  onClose: () => void; onApply: () => void; onAnalyze: () => void;
  getDaysUntilDeadline: (d: string | null) => number | null; getDifficultyColor: (d: string) => string;
}) {
  const skills = JSON.parse(internship.skillsRequired || "[]");
  const techStack = JSON.parse(internship.techStack || "[]");
  const daysLeft = getDaysUntilDeadline(internship.deadline);
  const [activeTab, setActiveTab] = useState<"overview" | "match" | "prepare">("overview");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[85vh] overflow-y-auto glass rounded-2xl border border-white/10"
        style={{ background: "rgba(17,17,24,0.98)" }}>

        {/* Header */}
        <div className="sticky top-0 z-10 p-5 border-b border-white/5 flex items-start justify-between" style={{ background: "rgba(17,17,24,0.98)", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-3">
            {internship.companyLogo ? (
              <img src={internship.companyLogo} alt="" className="w-12 h-12 rounded-xl object-contain bg-white/5 p-1" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-lg font-bold text-indigo-400">
                {internship.company[0]}
              </div>
            )}
            <div>
              <h2 className="font-bold text-lg">{internship.title}</h2>
              <p className="text-sm text-indigo-400">{internship.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {(internship._isLive ? (["overview", "prepare"] as const) : (["overview", "match", "prepare"] as const)).map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); if (tab === "match" && !matchResult && !matching) onAnalyze(); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500 hover:text-white"}`}>
              {tab === "overview" ? "Overview" : tab === "match" ? "AI Match Analysis" : "Interview Prep"}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Key Info Grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: DollarSign, label: "Stipend", value: internship.stipend || "Unpaid", color: "green" },
                  { icon: MapPin, label: "Location", value: `${internship.city}, ${internship.country}`, color: "purple" },
                  { icon: Clock, label: "Duration", value: internship.duration, color: "blue" },
                  { icon: Calendar, label: "Start", value: internship.startDate ? new Date(internship.startDate).toLocaleDateString() : "Flexible", color: "amber" },
                  { icon: Users, label: "Openings", value: `${internship.openings} positions`, color: "indigo" },
                  { icon: Target, label: "Acceptance", value: `${Math.round(internship.acceptanceRate * 100)}%`, color: "red" },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <item.icon className={`w-4 h-4 text-${item.color}-400 mx-auto mb-1`} />
                    <div className="text-[10px] text-slate-500">{item.label}</div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">About this internship</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{internship.description}</p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s: string) => (
                    <span key={s} className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20">{s}</span>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              {techStack.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((t: string) => (
                      <span key={t} className="px-3 py-1 rounded-lg bg-white/5 text-slate-300 text-xs border border-white/5">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Benefits</h3>
                <div className="flex flex-wrap gap-3">
                  {internship.isPPO && <span className="flex items-center gap-1.5 text-xs text-amber-400"><Award className="w-3.5 h-3.5" /> PPO Opportunity</span>}
                  {internship.isCertified && <span className="flex items-center gap-1.5 text-xs text-green-400"><CheckCircle className="w-3.5 h-3.5" /> Certificate</span>}
                  {internship.mentorAvailable && <span className="flex items-center gap-1.5 text-xs text-blue-400"><GraduationCap className="w-3.5 h-3.5" /> Mentor Available</span>}
                  {internship.lorAvailable && <span className="flex items-center gap-1.5 text-xs text-purple-400"><Star className="w-3.5 h-3.5" /> Letter of Recommendation</span>}
                </div>
              </div>

              {/* Deadline + Apply */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  {daysLeft !== null && (
                    <span className={`text-sm ${daysLeft <= 7 ? "text-red-400 font-bold" : "text-slate-400"}`}>
                      {daysLeft > 0 ? `${daysLeft} days until deadline` : "Deadline passed"}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <a href={internship.applyUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400 transition-colors">
                    <ExternalLink className="w-4 h-4" /> {internship._isLive ? "Apply on Original Posting" : "Apply on Company Site"}
                  </a>
                  {!internship._isLive && (
                    <button onClick={onApply}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-400 hover:text-white transition-colors">
                      <Send className="w-4 h-4" /> Track Application
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "match" && (
            <div className="space-y-5">
              {matching ? (
                <div className="text-center py-12">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-slate-400">AI is analyzing your profile against this internship...</p>
                </div>
              ) : matchResult ? (
                <>
                  {/* Match Score Hero */}
                  <div className="flex items-center gap-6 p-5 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/20">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                          stroke={matchResult.matchScore >= 70 ? "#10b981" : matchResult.matchScore >= 40 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="3" strokeDasharray={`${matchResult.matchScore}, 100`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{matchResult.matchScore}%</span>
                      </div>
                    </div>
                    <div>
                      <div className={`text-xl font-bold ${matchResult.matchScore >= 70 ? "text-green-400" : matchResult.matchScore >= 40 ? "text-amber-400" : "text-red-400"}`}>
                        {matchResult.matchScore >= 70 ? "Strong Match" : matchResult.matchScore >= 40 ? "Moderate Match" : "Weak Match"}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">Selection probability: <span className="text-white font-medium">{matchResult.selectionProbability}%</span></p>
                    </div>
                  </div>

                  {/* Sub-scores */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Skill Match", value: matchResult.skillMatch, color: "indigo" },
                      { label: "Domain Match", value: matchResult.domainMatch, color: "purple" },
                      { label: "Resume Readiness", value: matchResult.resumeReadiness, color: "emerald" },
                    ].map(s => (
                      <div key={s.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                        <div className="text-[10px] text-slate-500 mb-1">{s.label}</div>
                        <div className={`text-lg font-bold text-${s.color}-400`}>{s.value}%</div>
                      </div>
                    ))}
                  </div>

                  {/* Matched Skills */}
                  {matchResult.matchedSkills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Skills You Have</h3>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.matchedSkills.map(s => (
                          <span key={s} className="px-3 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs border border-green-500/20">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {matchResult.missingSkills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Skills to Learn</h3>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.missingSkills.map(s => (
                          <span key={s} className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20">{s}</span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Estimated learning time: <span className="text-white font-medium">{matchResult.totalLearningDays} days</span></p>
                    </div>
                  )}

                  {/* Learning Roadmap */}
                  {matchResult.roadmap.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-indigo-400 mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" /> AI Learning Roadmap</h3>
                      <div className="space-y-2">
                        {matchResult.roadmap.map(item => (
                          <div key={item.skill} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{item.skill}</span>
                              <span className="text-xs text-slate-500">Week {item.week} · {item.hours}h</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {item.resources.map((r, i) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">{r}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-1">AI Match Analysis</h3>
                  <p className="text-sm text-slate-500 mb-4">Click analyze to see how well you match this internship</p>
                  <button onClick={onAnalyze}
                    className="px-6 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400 transition-colors">
                    <Brain className="w-4 h-4 inline mr-2" /> Analyze Match
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "prepare" && (
            <div className="space-y-5">
              <div className="glass p-5 text-center">
                <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">AI Interview Preparation</h3>
                <p className="text-sm text-slate-400 mb-4">Get company-specific interview questions and preparation tips for {internship.company}</p>
                <div className="grid grid-cols-2 gap-3 text-left">
                  {[
                    { icon: Target, title: "Technical Questions", desc: `${internship.company}-specific coding challenges` },
                    { icon: Users, title: "Behavioral Questions", desc: "STAR method answers tailored to their culture" },
                    { icon: Briefcase, title: "System Design", desc: "Architecture problems they ask in interviews" },
                    { icon: FileText, title: "Resume Deep Dive", desc: "Questions about your projects and experience" },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <item.icon className="w-4 h-4 text-indigo-400 mb-2" />
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-600 mt-4">Tip: Complete the Panel Interview practice first — it covers behavioral, technical, and HR rounds.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function TrackerModal({ data, onClose }: { data: any; onClose: () => void }) {
  const stages = ["saved", "applied", "shortlisted", "assessment", "interview", "rejected", "offer", "accepted"];
  const stageColors: Record<string, string> = {
    saved: "bg-slate-500", applied: "bg-blue-500", shortlisted: "bg-indigo-500",
    assessment: "bg-amber-500", interview: "bg-purple-500", rejected: "bg-red-500",
    offer: "bg-green-500", accepted: "bg-emerald-500",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto glass rounded-2xl border border-white/10 p-6"
        style={{ background: "rgba(17,17,24,0.98)" }}>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Application Tracker</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {data ? (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <div className="text-lg font-bold text-indigo-400">{data.stats.total}</div>
                <div className="text-[10px] text-slate-500">Total Applications</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <div className="text-lg font-bold text-amber-400">{data.stats.interviewRate}%</div>
                <div className="text-[10px] text-slate-500">Interview Rate</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <div className="text-lg font-bold text-green-400">{data.stats.offerRate}%</div>
                <div className="text-[10px] text-slate-500">Offer Rate</div>
              </div>
            </div>

            {/* Pipeline */}
            {stages.map(stage => {
              const items = data.pipeline[stage] || [];
              if (items.length === 0) return null;
              return (
                <div key={stage}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${stageColors[stage]}`} />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stage} ({items.length})</span>
                  </div>
                  <div className="space-y-1.5 ml-4">
                    {items.map((app: any) => (
                      <div key={app.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-xs font-bold text-indigo-400">
                          {app.internship.company[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{app.internship.title}</div>
                          <div className="text-xs text-slate-500">{app.internship.company}</div>
                        </div>
                        {app.matchScore > 0 && (
                          <span className="text-xs text-indigo-400 font-bold">{Math.round(app.matchScore)}%</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {data.stats.total === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">
                No applications yet. Start exploring internships!
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
