"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Send, Target, TrendingUp, AlertTriangle, CheckCircle,
  Clock, Zap, ArrowRight, Briefcase, FileText, Mic, Brain, RefreshCw
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/Toast";
import PageTour from "@/components/PageTour";

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

const INITIAL_ACTIONS: ActionItem[] = [];

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
  const { user, loading: authLoading, logout } = useAuth({ requireOnboarded: true });
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
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const assistantMsg: AgentMessage = {
        role: "assistant",
        content: data.response || "I'll help you figure that out. Can you tell me more about your career goals?",
        actions: data.actions || [],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      if (data.actions?.length) {
        setActions(prev => [...data.actions, ...prev]);
        toast.success(`${data.actions.length} new action item${data.actions.length > 1 ? "s" : ""}`);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }]);
    }
    setLoading(false);
  };

  const toggleAction = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Side Profile */}
      <div data-tour="agent-rail" className="w-64 shrink-0 border-r border-white/5 p-4 hidden md:flex flex-col" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="font-bold text-sm">Career Agent</h1>
            <p className="text-[10px] text-slate-500">AI-powered {user?.name?.split(" ")[0] || "assistant"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3 h-3" />
            Active
          </div>
          <button onClick={() => setMessages([messages[0]])} className="text-xs text-slate-500 hover:text-white transition-colors ml-auto">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {actions.map(action => (
            <div key={action.id}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                action.done ? "opacity-40" : ""
              } ${
                action.priority === "high" ? "border-red-500/20 bg-red-500/5" :
                action.priority === "medium" ? "border-amber-500/20 bg-amber-500/5" :
                "border-white/5 bg-white/[0.02]"
              }`}
              onClick={() => toggleAction(action.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                {(() => { const Icon = TYPE_ICONS[action.type] || Target; return <Icon className="w-3 h-3 text-indigo-400" />; })()}
                <span className="font-medium truncate">{action.title}</span>
              </div>
              <p className="text-[10px] text-slate-500">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="shrink-0 px-6 py-3 border-b border-white/5 flex items-center justify-between" style={{ background: "rgba(17,17,24,0.5)" }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-sm">AI Career Agent</span>
            </div>
            <span className="text-[10px] text-slate-500">|</span>
            <span className="text-xs text-slate-500">{actions.filter(a => !a.done).length} pending items</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab(activeTab === "chat" ? "actions" : "chat")}
              className="md:hidden text-xs text-slate-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5">
              {activeTab === "chat" ? "Actions" : "Chat"}
            </button>
            <button onClick={logout} className="text-xs text-slate-500 hover:text-red-400 transition-colors">
              Sign out
            </button>
          </div>
        </div>

        {/* Messages */}
        <div data-tour="agent-chat" className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-500/20 text-indigo-100 rounded-tr-md"
                  : "bg-white/5 text-slate-200 rounded-tl-md"
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 rounded-2xl rounded-tl-md px-4 py-3">
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
        <div data-tour="agent-input" className="shrink-0 p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask your career agent..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30 transition-colors placeholder:text-slate-600"
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 flex items-center justify-center transition-colors shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <PageTour id="agent" steps={[
        { target: "[data-tour='agent-rail']", title: "AI Career Agent", body: "Your personalized action list — the agent prioritizes exactly what to do next." },
        { target: "[data-tour='agent-chat']", title: "Ask anything", body: "Chat with your career coach about paths, skills, applications and more." },
        { target: "[data-tour='agent-input']", title: "Type & send", body: "Ask in English or Hindi — the agent replies with actionable steps." },
      ]} />
    </div>
  );
}
