"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, LogOut, LayoutDashboard, Route, Sparkles, UsersRound,
  Layers, FileText, Briefcase, TrendingUp, Mic, Menu, X, GraduationCap,
  Shield, BookOpen, Brain, School
} from "lucide-react";
import { CommandPalette } from "./CommandPalette";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";

const NAV = [
  { href: "/dashboard", label: "dashboard.dashboard", icon: LayoutDashboard },
  { href: "/aptitude-test", label: "nav.aptitudeTest", icon: Brain },
  { href: "/paths", label: "nav.careerPaths", icon: Route },
  { href: "/jobs", label: "nav.jobs", icon: Briefcase },
  { href: "/internships", label: "nav.internships", icon: GraduationCap, badge: "AI" },
  { href: "/panel-interview", label: "nav.panelInterview", icon: UsersRound, badge: "AI" },
  { href: "/automation-shield", label: "nav.automationShield", icon: Shield },
  { href: "/govt-schemes", label: "nav.govtSchemes", icon: BookOpen },
  { href: "/college", label: "nav.collegeDashboard", icon: School },
  { href: "/digital-twin", label: "nav.digitalTwin", icon: Layers },
  { href: "/resume-builder", label: "nav.resumeBuilder", icon: FileText },
  { href: "/skills", label: "nav.skills", icon: TrendingUp },
];

interface SidebarProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const getLabel = (key: string) => {
    const keys = key.split(".");
    let val: any = t;
    for (const k of keys) {
      val = val?.[k];
    }
    return typeof val === "string" ? val : key;
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
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <CommandPalette />
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1">
        {NAV.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 font-medium"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{getLabel(item.label)}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                  {item.badge}
                </span>
              )}
            </Link>
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
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

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

      <aside className="hidden lg:flex w-64 border-r border-white/5 p-4 flex-col shrink-0 overflow-y-auto"
        style={{ background: "rgba(17,17,24,0.5)" }}
      >
        {navContent}
      </aside>
    </>
  );
}
