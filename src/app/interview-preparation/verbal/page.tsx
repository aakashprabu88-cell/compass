"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, BookText, FileText, AlignLeft, SpellCheck, Type, BookA, Quote, MessageSquare, Search, Volume2, ChevronRight, Brain, Languages } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageTour from "@/components/PageTour";

const TOPICS = [
  { id: "grammar", icon: BookText, title: "Grammar", desc: "Tenses, parts of speech, subject-verb agreement, and sentence structure.", color: "rgba(99,102,241,0.15)" },
  { id: "vocabulary", icon: BookA, title: "Vocabulary", desc: "Word meanings, roots, prefixes, suffixes, and word building.", color: "rgba(168,85,247,0.15)" },
  { id: "reading-comprehension", icon: FileText, title: "Reading Comprehension", desc: "Passage analysis, inference, main idea, and critical reading.", color: "rgba(6,182,212,0.15)" },
  { id: "sentence-correction", icon: AlignLeft, title: "Sentence Correction", desc: "Error spotting, sentence improvement, and grammatical correctness.", color: "rgba(244,63,94,0.15)" },
  { id: "para-jumbles", icon: BookOpen, title: "Para Jumbles", desc: "Rearrange sentences into coherent paragraphs and passages.", color: "rgba(16,185,129,0.15)" },
  { id: "fill-blanks", icon: Type, title: "Fill in the Blanks", desc: "Contextual word selection, cloze tests, and gap filling.", color: "rgba(245,158,11,0.15)" },
  { id: "synonyms", icon: Languages, title: "Synonyms", desc: "Similar words, contextual meanings, and word relationships.", color: "rgba(99,102,241,0.15)" },
  { id: "antonyms", icon: Search, title: "Antonyms", desc: "Opposite words, negative prefixes, and contrast relationships.", color: "rgba(168,85,247,0.15)" },
  { id: "idioms", icon: Quote, title: "Idioms & Phrases", desc: "Common idioms, phrasal verbs, and figurative language.", color: "rgba(6,182,212,0.15)" },
  { id: "error-spotting", icon: SpellCheck, title: "Error Spotting", desc: "Identify grammatical errors in sentences and passages.", color: "rgba(244,63,94,0.15)" },
  { id: "one-word", icon: MessageSquare, title: "One Word Substitution", desc: "Replace phrases with single words accurately.", color: "rgba(16,185,129,0.15)" },
  { id: "speaking", icon: Volume2, title: "AI Speaking Practice", desc: "Voice-based English speaking practice with AI feedback.", color: "rgba(245,158,11,0.15)" },
];

export default function VerbalPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch (e) { console.error("verbal load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6" data-tour="prep-verbal-header">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Verbal Ability</h1>
                <p className="text-sm text-slate-400">Build strong English language skills for interviews, exams, and professional communication</p>
              </div>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3" data-tour="prep-verbal-grid">
            {TOPICS.map((topic, i) => (
              <motion.div key={topic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 * i }}>
                <div className="group block p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                  style={{ background: "rgba(17,17,24,0.5)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: topic.color }}>
                      <topic.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-semibold text-sm">{topic.title}</h3>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                      <p className="text-xs text-slate-500">{topic.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <PageTour id="prep-verbal" steps={[
          { target: "[data-tour='prep-verbal-header']", title: "Verbal Ability", body: "Sharpen reading comprehension, vocabulary and grammar for interviews." },
          { target: "[data-tour='prep-verbal-grid']", title: "12 topic sets", body: "Each topic has theory, practice questions and pro tips." }
        ]} />
      </main>
    </div>
  );
}
