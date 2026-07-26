"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass, LogOut, LayoutDashboard, Route, Target, Briefcase, FileText,
  Building2, GraduationCap, IndianRupee, MessageSquare, Shield,
  Lightbulb, Copy, Check, TrendingUp, AlertCircle, ChevronDown, ChevronUp,
  Trophy,
  GitBranch,
  Radar,
  Mic,
} from "lucide-react";
import {
  OfferDetails,
  NegotiationScript,
  PushbackResponse,
  MarketComparison,
  generateCounterOffers,
  generatePushbackResponses,
  calculateMarketComparison,
  generateNegotiationTips,
} from "@/lib/negotiation";

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

const LOCATIONS = ["Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune", "Remote"];

const TONE_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  aggressive: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", dot: "bg-red-400" },
  moderate: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", dot: "bg-blue-400" },
  conservative: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", dot: "bg-green-400" },
};

const PERCENTILE_COLORS: Record<string, string> = {
  "Below 25th": "text-red-400",
  "25th–50th": "text-yellow-400",
  "50th–75th": "text-blue-400",
  "Above 75th": "text-green-400",
};

export default function NegotiationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [offeredSalary, setOfferedSalary] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [experience, setExperience] = useState("");

  const [scripts, setScripts] = useState<NegotiationScript[]>([]);
  const [pushbacks, setPushbacks] = useState<PushbackResponse[]>([]);
  const [marketComp, setMarketComp] = useState<MarketComparison | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [expandedPushback, setExpandedPushback] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      setLoading(false);
    });
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const handleGenerate = () => {
    if (!company || !role || !offeredSalary || !experience) return;
    setGenerating(true);
    setTimeout(() => {
      const offer: OfferDetails = {
        company,
        role,
        offeredSalary: parseFloat(offeredSalary),
        location,
        experience: parseInt(experience),
      };
      setScripts(generateCounterOffers(offer));
      setPushbacks(generatePushbackResponses(offer));
      setMarketComp(calculateMarketComparison(offer));
      setTips(generateNegotiationTips(offer));
      setGenerating(false);
      setActiveTab(0);
    }, 800);
  };

  const copyScript = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 75) return "text-green-400";
    if (score >= 55) return "text-yellow-400";
    return "text-red-400";
  };

  const getPercentileWidth = (pct: string) => {
    switch (pct) {
      case "Below 25th": return "15%";
      case "25th–50th": return "37%";
      case "50th–75th": return "62%";
      case "Above 75th": return "85%";
      default: return "50%";
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center"><Compass className="w-5 h-5 text-indigo-400" /></div><span className="font-bold">Compass</span></div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.href === "/negotiation" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
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
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2"><IndianRupee className="w-6 h-6 text-indigo-400" /> Salary Negotiation Coach</h1>
          <p className="text-slate-400 text-sm mb-8">Generate personalized negotiation scripts, counter-offers, and pushback responses</p>

          {/* Input Form */}
          <div className="glass p-6 mb-8">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-indigo-400" /> Offer Details</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Company Name</label>
                <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Infosys, Google, Flipkart" className="w-full !rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Role</label>
                <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Software Engineer, Data Scientist" className="w-full !rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Offered Salary (LPA)</label>
                <input type="number" value={offeredSalary} onChange={e => setOfferedSalary(e.target.value)} placeholder="e.g. 12" min="0" step="0.5" className="w-full !rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Location</label>
                <select value={location} onChange={e => setLocation(e.target.value)} className="w-full !rounded-xl text-sm">
                  {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Years of Experience</label>
                <input type="number" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 3" min="0" max="40" className="w-full !rounded-xl text-sm" />
              </div>
            </div>
            <button onClick={handleGenerate} disabled={generating || !company || !role || !offeredSalary || !experience}
              className="w-full py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {generating ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating Scripts...</> : <><IndianRupee className="w-4 h-4" /> Generate Scripts</>}
            </button>
          </div>

          {/* Results */}
          {marketComp && (
            <div className="space-y-8">
              {/* Market Comparison */}
              <div className="glass p-6 glow-sm">
                <h2 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-400" /> Market Comparison</h2>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="text-center p-3 rounded-xl bg-white/[0.02]">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Your Offer</div>
                    <div className="text-2xl font-bold">{marketComp.yourOffer} LPA</div>
                    <div className={`text-xs mt-1 font-medium ${PERCENTILE_COLORS[marketComp.percentile]}`}>{marketComp.percentile} percentile</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/[0.02]">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Market Median</div>
                    <div className="text-2xl font-bold">{marketComp.marketMedian} LPA</div>
                    <div className="text-xs text-slate-500 mt-1">50th percentile</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/[0.02]">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Top Offers</div>
                    <div className="text-2xl font-bold">{marketComp.marketTop} LPA</div>
                    <div className="text-xs text-slate-500 mt-1">90th percentile</div>
                  </div>
                </div>
                {/* Percentile Bar */}
                <div className="relative">
                  <div className="h-4 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-500/60 via-yellow-500/60 to-green-500/60" style={{ width: "100%" }} />
                  </div>
                  <div className="absolute top-0 h-4 w-1 bg-white rounded-full shadow-lg transition-all" style={{ left: getPercentileWidth(marketComp.percentile) }} />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-slate-600">
                  <span>0</span>
                  <span>{marketComp.marketMedian} LPA (Median)</span>
                  <span>{marketComp.marketTop} LPA</span>
                </div>
                {marketComp.belowMarket && (
                  <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-2 text-sm text-yellow-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Your offer is below market median. You have strong grounds to negotiate.
                  </div>
                )}
              </div>

              {/* Negotiation Scripts */}
              <div>
                <h2 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-indigo-400" /> Negotiation Scripts</h2>
                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  {scripts.map((s, i) => {
                    const colors = TONE_COLORS[s.tone];
                    return (
                      <button key={i} onClick={() => setActiveTab(i)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                          activeTab === i ? `${colors.bg} ${colors.text} ${colors.border}` : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        {s.tone.charAt(0).toUpperCase() + s.tone.slice(1)}
                      </button>
                    );
                  })}
                </div>

                {/* Active Script */}
                {scripts[activeTab] && (
                  <div className="glass p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TONE_COLORS[scripts[activeTab].tone].bg} ${TONE_COLORS[scripts[activeTab].tone].text}`}>
                        {scripts[activeTab].tone.toUpperCase()} APPROACH
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Confidence:</span>
                        <span className={`text-sm font-bold ${getConfidenceColor(scripts[activeTab].confidenceScore)}`}>{scripts[activeTab].confidenceScore}%</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-5">
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Opening</div>
                        <p className="text-sm text-slate-300 leading-relaxed">{scripts[activeTab].openingLine}</p>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Body</div>
                        <p className="text-sm text-slate-300 leading-relaxed">{scripts[activeTab].body}</p>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Closing</div>
                        <p className="text-sm text-slate-300 leading-relaxed">{scripts[activeTab].closingLine}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Full Script</div>
                        <button onClick={() => copyScript(scripts[activeTab].fullScript, activeTab)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                          {copiedIdx === activeTab ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Script</>}
                        </button>
                      </div>
                      <textarea readOnly value={scripts[activeTab].fullScript} rows={8}
                        className="w-full !rounded-xl text-sm !bg-white/[0.02] !border-white/10 resize-none font-mono leading-relaxed" />
                    </div>
                  </div>
                )}
              </div>

              {/* Pushback Responses */}
              <div>
                <h2 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-indigo-400" /> Pushback Responses</h2>
                <div className="space-y-3">
                  {pushbacks.map((pb, i) => (
                    <div key={i} className="glass overflow-hidden">
                      <button onClick={() => setExpandedPushback(expandedPushback === i ? null : i)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-mono">#{i + 1}</span>
                          <span className="text-sm font-medium">{pb.objection}</span>
                        </div>
                        {expandedPushback === i ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </button>
                      {expandedPushback === i && (
                        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                          <div>
                            <div className="text-xs text-emerald-400 uppercase tracking-wider mb-1">Response</div>
                            <p className="text-sm text-slate-300 leading-relaxed">{pb.response}</p>
                          </div>
                          <div>
                            <div className="text-xs text-blue-400 uppercase tracking-wider mb-1">Follow-Up</div>
                            <p className="text-sm text-slate-300 leading-relaxed">{pb.followUp}</p>
                          </div>
                          <button onClick={() => copyScript(`${pb.objection}\n\nResponse: ${pb.response}\n\nFollow-Up: ${pb.followUp}`, 100 + i)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            {copiedIdx === 100 + i ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="glass p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-400" /> Negotiation Tips</h2>
                <div className="space-y-3">
                  {tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02]">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
