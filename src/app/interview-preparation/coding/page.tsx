"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Play, RefreshCw, AlertTriangle, CheckCircle2, Clock, Code2, Lightbulb, ChevronRight, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";

const PROBLEMS = [
  { id: "two-sum", title: "Two Sum", difficulty: "Easy", desc: "Find two numbers that add up to target." },
  { id: "reverse-string", title: "Reverse String", difficulty: "Easy", desc: "Reverse a string in-place." },
  { id: "valid-parentheses", title: "Valid Parentheses", difficulty: "Medium", desc: "Check if parentheses are valid." },
  { id: "max-subarray", title: "Maximum Subarray", difficulty: "Medium", desc: "Find contiguous subarray with max sum." },
  { id: "lru-cache", title: "LRU Cache", difficulty: "Hard", desc: "Design and implement an LRU cache." },
];

const DEFAULT_CODE = `function twoSum(nums, target) {
  // Write your solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test case
console.log(twoSum([2, 7, 11, 15], 9));
`;

export default function CodingPlaygroundPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth({ requireOnboarded: true });
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runCode = () => {
    setRunning(true);
    setOutput([]);
    setTimeout(() => {
      try {
        const logs: string[] = [];
        const mockLog = console.log;
        console.log = (...args: any[]) => logs.push(args.map(String).join(" "));
        try {
          new Function(code)();
        } catch (e: any) {
          logs.push(`Error: ${e.message}`);
        }
        console.log = mockLog;
        setOutput(logs.length > 0 ? logs : ["No output (check your code for errors)"]);
      } catch (e: any) {
        setOutput([`Runtime error: ${e.message}`]);
      }
      setRunning(false);
    }, 500);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Link href="/interview-preparation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interview Prep
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">AI Coding Playground</h1>
              <p className="text-slate-400 text-sm">Write, run, and get AI feedback on your code</p>
            </div>
            <button onClick={runCode} disabled={running}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
              {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run Code
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Problem List */}
            <div className="space-y-2">
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Problems</h3>
              {PROBLEMS.map(p => (
                <button key={p.id} onClick={() => { setSelectedProblem(p); setOutput([]); }}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                    selectedProblem.id === p.id ? "bg-indigo-500/10 border-indigo-500/30" : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}>
                  <div className="font-medium">{p.title}</div>
                  <div className={`text-[10px] mt-0.5 ${
                    p.difficulty === "Easy" ? "text-green-400" : p.difficulty === "Medium" ? "text-yellow-400" : "text-red-400"
                  }`}>{p.difficulty}</div>
                </button>
              ))}
            </div>

            {/* Code Editor */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-white/5 overflow-hidden" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Code2 className="w-3.5 h-3.5" />
                    {selectedProblem.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Lightbulb className="w-3 h-3" />
                    <span>Hint</span>
                  </div>
                </div>
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full bg-transparent p-4 text-sm font-mono outline-none resize-none"
                  style={{ minHeight: "400px", color: "#e2e8f0", caretColor: "#818cf8" }}
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Output */}
            <div>
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Output</h3>
              <div className="rounded-xl border border-white/5 p-4" style={{ background: "rgba(17,17,24,0.5)", minHeight: "200px" }}>
                {output.length > 0 ? (
                  <div className="space-y-1">
                    {output.map((line, i) => (
                      <div key={i} className="text-xs font-mono text-slate-300">{line}</div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-600 italic">Click Run to see output</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
