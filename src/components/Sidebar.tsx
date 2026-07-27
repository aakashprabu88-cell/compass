"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, LogOut, LayoutDashboard, Route, Target, BarChart3, Shield,
  TrendingUp, Sparkles, Building2, Users, FileText, GraduationCap,
  Briefcase, Zap, Radar, IndianRupee, Trophy, Mic, Menu, X, ChevronDown,
  GitBranch, Search
} from "lucide-react";
import { CommandPalette } from "./CommandPalette";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Core",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/co-pilot", label: "AI Co-pilot", icon: Sparkles, badge: "AI" },
      { href: "/paths", label: "Career Paths", icon: Route },
    ],
  },
  {
    title: "Job Search",
    items: [
      { href: "/jobs", label: "Jobs & Internships", icon: Briefcase },
      { href: "/pipeline", label: "Pipeline", icon: GitBranch },
      { href: "/applications", label: "Applications", icon: FileText },
    ],
  },
  {
    title: "Interview",
    items: [
      { href: "/mock-interview", label: "Mock Interview", icon: Mic },
      { href: "/interview-tracker", label: "Interview Tracker", icon: BarChart3 },
      { href: "/company-prep", label: "Company Prep", icon: Target },
    ],
  },
  {
    title: "Skills & Resume",
    items: [
      { href: "/skills", label: "Skill Analysis", icon: TrendingUp },
      { href: "/skill-graph", label: "Skill Graph", icon: Radar },
      { href: "/resume-builder", label: "Resume Builder", icon: FileText },
      { href: "/ab-test", label: "A/B Test", icon: Zap },
    ],
  },
  {
    title: "Insights",
    items: [
      { href: "/companies", label: "Companies", icon: Building2 },
      { href: "/intelligence", label: "Intelligence", icon: Shield },
      { href: "/benchmark", label: "Benchmarking", icon: Users },
      { href: "/negotiation", label: "Negotiation", icon: IndianRupee },
    ],
  },
  {
    title: "More",
    items: [
      { href: "/tracker", label: "Leaderboard", icon: Trophy },
      { href: "/courses", label: "Courses", icon: GraduationCap },
      { href: "/govt-exams", label: "Govt Exams", icon: Shield },
      { href: "/simulator", label: "Simulator", icon: TrendingUp },
    ],
  },
];

interface SidebarProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (title: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const navContent = (
    <>
      <div className="flex items-center justify-between mb-6 px-2">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold text-lg">Compass</span>
        </Link>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4">
        <CommandPalette />
      </div>

      <nav className="flex-1 overflow-y-auto space-y-4">
        {NAV_GROUPS.map(group => {
          const isCollapsed = collapsedGroups.has(group.title);
          return (
            <div key={group.title}>
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors"
              >
                {group.title}
                <ChevronDown className={`w-3 h-3 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5 mt-1">
                  {group.items.map(item => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                          isActive
                            ? "bg-indigo-500/10 text-indigo-400 font-medium"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
            {user?.name?.[0]}
          </div>
          <div className="text-sm truncate">{user?.name}</div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 w-full transition-colors rounded-lg hover:bg-red-500/5">
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

export { NAV_GROUPS };
