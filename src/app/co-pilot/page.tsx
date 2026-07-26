"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, LogOut, Send, Sparkles, User, Loader2, Lightbulb, Route, Briefcase, Target } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface Message { role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  { icon: Route, text: "What career paths match my skills?", color: "text-indigo-400" },
  { icon: Target, text: "What skills should I learn next?", color: "text-emerald-400" },
  { icon: Briefcase, text: "How do I prepare for Google interviews?", color: "text-amber-400" },
  { icon: Lightbulb, text: "Is software engineering safe from AI?", color: "text-purple-400" },
];

export default function CoPilotPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileContext, setProfileContext] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/login"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/login"); return; }
        if (!data.onboarded) { router.push("/onboarding"); return; }
        setUser(data);

        const cached = localStorage.getItem("compass_career_advice");
        if (cached) {
          const advice = JSON.parse(cached);
          setProfileContext(
            `User: ${data.name}. ` +
            `AI recommended careers: ${advice.recommendedPaths?.map((p: any) => `${p.title} (${p.matchScore}%)`).join(", ") || "Not yet analyzed"}. ` +
            `Skill gaps: ${advice.skillGaps?.map((g: any) => `${g.skill} (${g.priority})`).join(", ") || "Not yet analyzed"}.`
          );
        }
      } catch {
        router.push("/login");
      }
    }
    load();
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, profileContext }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages([...newMessages, { role: "assistant", content: `Sorry, I encountered an error: ${data.error}` }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.response }]);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "I'm having trouble connecting. Please try again." }]);
    }
    setLoading(false);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/5 p-4 flex items-center gap-3 shrink-0" style={{ background: "rgba(17,17,24,0.3)" }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold">AI Career Co-pilot</h1>
            <p className="text-xs text-slate-500">Powered by Gemini 2.0 Flash — Ask anything about your career</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">What&apos;s on your mind?</h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  I know your career profile. Ask me anything about career paths, skills, interviews, or job market trends.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      onClick={() => sendMessage(s.text)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 text-left transition-all group"
                    >
                      <s.icon className={`w-4 h-4 ${s.color} shrink-0`} />
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{s.text}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 mb-6 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-500 text-white rounded-br-md"
                      : "bg-white/[0.05] border border-white/5 text-slate-200 rounded-bl-md"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 mb-6"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/[0.05] border border-white/5 rounded-2xl rounded-bl-md p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span className="text-sm text-slate-400">Thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-white/5 p-4 shrink-0" style={{ background: "rgba(17,17,24,0.3)" }}>
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="max-w-3xl mx-auto flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about careers, skills, interviews, salary..."
              disabled={loading}
              className="flex-1 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm focus:outline-none focus:border-indigo-500/40 transition-colors placeholder-slate-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
