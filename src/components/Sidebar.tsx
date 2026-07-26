"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, Shield,
  ChevronRight, TrendingUp, AlertTriangle, Sparkles, ArrowRight,
  Building2, Users, FileText, Upload, GraduationCap, Briefcase, Calendar,
  Zap, GitBranch, Radar, IndianRupee, Trophy, Mic, Menu, X
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/co-pilot", label: "AI Co-pilot", icon: Sparkles },
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

interface SidebarProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold">Compass</span>
        </div>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {NAV.map(item => (
          <Link key={item.href} href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              pathname === item.href ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}>
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
            {user?.name?.[0]}
          </div>
          <div className="text-sm truncate">{user?.name}</div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 w-64 h-full border-r border-white/5 p-4 flex flex-col z-50 lg:hidden"
            style={{ background: "rgba(17,17,24,0.95)", backdropFilter: "blur(20px)" }}
          >
            {navContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-white/5 p-4 flex-col shrink-0 overflow-y-auto"
        style={{ background: "rgba(17,17,24,0.5)" }}
      >
        {navContent}
      </aside>
    </>
  );
}

export { NAV };
