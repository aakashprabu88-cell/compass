"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Command } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  label: string;
  href: string;
  category: string;
}

const COMMANDS: CommandItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", category: "Navigation" },

  { id: "interview-prep", label: "Interview Preparation", href: "/interview-preparation", category: "Assessment" },
  { id: "paths", label: "Career Paths", href: "/paths", category: "Navigation" },
  { id: "jobs", label: "Jobs", href: "/jobs", category: "Navigation" },
  { id: "skills", label: "Skill Gaps", href: "/skills", category: "Navigation" },
  { id: "automation-shield", label: "AI Automation Shield", href: "/automation-shield", category: "Impact" },
  { id: "resume-builder", label: "Resume Builder", href: "/resume-builder", category: "AI Tools" },
  { id: "agent", label: "AI Career Agent", href: "/agent", category: "AI Tools" },
  { id: "panel-interview", label: "Panel Interview", href: "/panel-interview", category: "AI Tools" },
  { id: "email-campaign", label: "Email Outreach", href: "/email-campaign", category: "AI Tools" },
  { id: "internships", label: "Internships", href: "/internships", category: "AI Tools" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const runCommand = useCallback((cmd: CommandItem) => {
    router.push(cmd.href);
    setOpen(false);
    setQuery("");
  }, [router]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIdx(0);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx(i => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx(i => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter" && filtered[selectedIdx]) {
        runCommand(filtered[selectedIdx]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, selectedIdx, runCommand]);

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    (acc[cmd.category] ||= []).push(cmd);
    return acc;
  }, {});

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm text-slate-400 hover:text-white hover:border-white/20 transition-all"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white/5 rounded border border-white/10">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[90]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[100] rounded-2xl border border-white/10 overflow-hidden"
              style={{ background: "rgba(17,17,24,0.98)", backdropFilter: "blur(20px)" }}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search pages, features..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                />
                <kbd className="text-[10px] font-mono text-slate-600 px-1.5 py-0.5 border border-white/10 rounded">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="mb-2">
                    <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600">{category}</div>
                    {items.map(cmd => {
                      const idx = filtered.indexOf(cmd);
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => runCommand(cmd)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            idx === selectedIdx
                              ? "bg-indigo-500/10 text-indigo-400"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="flex-1 text-left">{cmd.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                        </button>
                      );
                    })}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-8 text-sm text-slate-500">No results found</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
