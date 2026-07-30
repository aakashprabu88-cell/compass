"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Search, Star, TrendingUp, Users, ChevronRight, BookOpen, Award, BarChart3 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const COMPANIES = [
  { name: "Google", tier: "FAANG", color: "rgba(66,133,244,0.15)", icon: "G" },
  { name: "Microsoft", tier: "FAANG", color: "rgba(0,120,215,0.15)", icon: "M" },
  { name: "Amazon", tier: "FAANG", color: "rgba(255,153,0,0.15)", icon: "A" },
  { name: "Meta", tier: "FAANG", color: "rgba(24,119,242,0.15)", icon: "M" },
  { name: "Apple", tier: "FAANG", color: "rgba(165,165,165,0.15)", icon: "A" },
  { name: "Netflix", tier: "FAANG", color: "rgba(229,9,20,0.15)", icon: "N" },
  { name: "Adobe", tier: "Product", color: "rgba(255,0,0,0.15)", icon: "A" },
  { name: "Oracle", tier: "Product", color: "rgba(235,10,10,0.15)", icon: "O" },
  { name: "Salesforce", tier: "Product", color: "rgba(0,129,207,0.15)", icon: "S" },
  { name: "Atlassian", tier: "Product", color: "rgba(0,82,204,0.15)", icon: "A" },
  { name: "Uber", tier: "Product", color: "rgba(0,0,0,0.15)", icon: "U" },
  { name: "Flipkart", tier: "Product", color: "rgba(40,116,240,0.15)", icon: "F" },
  { name: "Swiggy", tier: "Product", color: "rgba(252,89,0,0.15)", icon: "S" },
  { name: "Zomato", tier: "Product", color: "rgba(226,55,68,0.15)", icon: "Z" },
  { name: "Paytm", tier: "Product", color: "rgba(0,186,242,0.15)", icon: "P" },
  { name: "Razorpay", tier: "Product", color: "rgba(82,194,128,0.15)", icon: "R" },
  { name: "PhonePe", tier: "Product", color: "rgba(84,28,174,0.15)", icon: "P" },
  { name: "TCS", tier: "Service", color: "rgba(85,135,200,0.15)", icon: "T" },
  { name: "Infosys", tier: "Service", color: "rgba(60,120,224,0.15)", icon: "I" },
  { name: "Wipro", tier: "Service", color: "rgba(0,156,109,0.15)", icon: "W" },
  { name: "Accenture", tier: "Service", color: "rgba(161,33,232,0.15)", icon: "A" },
  { name: "Capgemini", tier: "Service", color: "rgba(0,120,105,0.15)", icon: "C" },
  { name: "Zoho", tier: "Product", color: "rgba(232,68,0,0.15)", icon: "Z" },
  { name: "Freshworks", tier: "Product", color: "rgba(0,175,154,0.15)", icon: "F" },
];

const TIERS = ["FAANG", "Product", "Service"];

export default function CompanyPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/"); return; }
        if (!data.onboarded) { router.push("/assessment"); return; }
        if (!cancelled) setUser(data);
      } catch (e) { console.error("company load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const filtered = COMPANIES.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedTier !== "all" && c.tier !== selectedTier) return false;
    return true;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Company-Specific Preparation</h1>
                <p className="text-sm text-slate-400">Hiring process, frequently asked questions, and AI-predicted questions for every company</p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-indigo-500/50 transition-all" />
              </div>
              <div className="flex gap-1.5">
                {["all", ...TIERS].map(tier => (
                  <button key={tier} onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                      selectedTier === tier ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"
                    }`}>
                    {tier === "all" ? "All" : tier}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((company, i) => (
              <motion.div key={company.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.015 * i }}>
                <Link href={`/interview-preparation/company/${company.name.toLowerCase()}`}
                  className="group block p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                  style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: company.color, color: company.color.replace("0.15", "1") }}>
                      {company.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{company.name}</h3>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">{company.tier}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
