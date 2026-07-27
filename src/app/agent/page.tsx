"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Send, Target, TrendingUp, AlertTriangle, CheckCircle,
  Clock, Zap, ArrowRight, Briefcase, FileText, Mic, Brain, RefreshCw
} from "lucide-react";
import { toast } from "@/components/Toast";

interface ActionItem {
  id: string;
  type: "apply" | "skill" | "interview" | "resume" | "insight";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}

interface AgentMessage {
  role: "user" | "assistant";
  content: string;
  actions?: ActionItem[];
  timestamp: Date;
}

const INITIAL_ACTIONS: ActionItem[] = [
  { id: "1", type: "apply", title: "Apply to 3 matching jobs", description: "Based on your skills, these companies are hiring now", priority: "high", done: false },
  { id: "2", type: "skill", title: "Practice System Design", description: "Your interview scores show this is a gap area", priority: "high", done: false },
  { id: "3", type: "resume", title: "Update resume with latest project", description: "Your last update was 2 weeks ago", priority: "medium", done: false },
  { id: "4", type: "interview", title: "Schedule mock interview", description: "You haven't practiced in 5 days", priority: "medium", done: false },
  { id: "5", type: "insight", title: "Check salary trends for your target role", description: "Market data updated yesterday", priority: "low", done: false },
];

const TYPE_ICONS: Record<string, typeof Target> = {
  apply: Briefcase,
  skill: TrendingUp,
  interview: Mic,
  resume: FileText,
  insight: Brain,
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  low: "text-slate-400 bg-white/5 border-white/10",
};

export default function AgentPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      role: "assistant",
      content: "Hey! I'm your AI Career Agent. I've been analyzing your profile and here's what I recommend you focus on this week. Check out the action items on the right — I've prioritized them based on your goals and market data.",
      timestamp: new Date(),
    },
  ]);
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "actions">("actions");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error || !d.onboarded) { router.push("/"); return; }
      setAuthed(true);
    }).catch(() => router.push("/"));
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: AgentMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context: { actions: actions.filter(a => !a.done) },
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response || "I'll help you with that. Let me analyze your situation.",
        actions: data.actions,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting. Try again in a moment.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAction = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));
  };

  const completedCount = actions.filter(a => a.done).length;
  const highPriority = actions.filter(a => a.priority === "high" && !a.done).length;

  if (!authed) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-white/5 flex items-center justify-between" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg">AI Career Agent</h1>
            <p className="text-xs text-slate-500">Proactive coaching based on your data</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-slate-400">Monitoring</span>
          </div>
          <div className="text-slate-500">{completedCount}/{actions.length} done</div>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="shrink-0 lg:hidden flex border-b border-white/5">
        {(["actions", "chat"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500"
            }`}
          >
            {tab === "actions" ? `Action Items (${actions.length})` : "Chat"}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Action Items Panel */}
        <div className={`${activeTab === "actions" ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-[380px] border-r border-white/5 overflow-y-auto`}>
          <div className="p-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <div className="text-lg font-bold text-indigo-400">{actions.length - completedCount}</div>
                <div className="text-[10px] text-slate-500">Remaining</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <div className="text-lg font-bold text-amber-400">{highPriority}</div>
                <div className="text-[10px] text-slate-500">High Priority</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <div className="text-lg font-bold text-green-400">{completedCount}</div>
                <div className="text-[10px] text-slate-500">Completed</div>
              </div>
            </div>

            {/* Priority section */}
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-2">High Priority</div>
            <div className="space-y-2 mb-4">
              {actions.filter(a => a.priority === "high").map(action => {
                const Icon = TYPE_ICONS[action.type] || Target;
                return (
                  <motion.div
                    key={action.id}
                    layout
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${PRIORITY_COLORS[action.priority]} ${action.done ? "opacity-50" : ""}`}
                    onClick={() => toggleAction(action.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${action.done ? "bg-green-500/10" : "bg-white/5"}`}>
                        {action.done ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${action.done ? "line-through text-slate-500" : ""}`}>{action.title}</div>
                        <div className="text-xs opacity-60 mt-0.5">{action.description}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 opacity-40 shrink-0 mt-1" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Other items */}
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-2">Other</div>
            <div className="space-y-2">
              {actions.filter(a => a.priority !== "high").map(action => {
                const Icon = TYPE_ICONS[action.type] || Target;
                return (
                  <motion.div
                    key={action.id}
                    layout
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${PRIORITY_COLORS[action.priority]} ${action.done ? "opacity-50" : ""}`}
                    onClick={() => toggleAction(action.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${action.done ? "bg-green-500/10" : "bg-white/5"}`}>
                        {action.done ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${action.done ? "line-through text-slate-500" : ""}`}>{action.title}</div>
                        <div className="text-xs opacity-60 mt-0.5">{action.description}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className={`${activeTab === "chat" ? "flex" : "hidden"} lg:flex flex-1 flex-col`}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-500/20 text-indigo-100"
                    : "bg-white/5 text-slate-300"
                }`}>
                  {msg.content}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {msg.actions.map(a => (
                        <div key={a.id} className="flex items-center gap-2 text-xs text-slate-400">
                          <Zap className="w-3 h-3 text-indigo-400" />
                          {a.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 rounded-2xl px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 p-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Ask your career agent..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30 transition-colors placeholder:text-slate-600"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
