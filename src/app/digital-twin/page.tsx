"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Target, TrendingUp, Briefcase, Star, Zap, Shield,
  ChevronRight, ArrowUpRight, Layers, Eye, Sparkles
} from "lucide-react";

interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  level: number; // 0-100
  category: string;
  marketDemand: number;
  salaryImpact: number;
  connections: string[];
}

interface CareerPath {
  id: string;
  title: string;
  fit: number;
  salary: string;
  growth: string;
  automationRisk: number;
}

const SKILL_NODES: SkillNode[] = [
  { id: "js", label: "JavaScript", x: 300, y: 200, level: 85, category: "Frontend", marketDemand: 95, salaryImpact: 80, connections: ["react", "node", "ts"] },
  { id: "react", label: "React", x: 180, y: 120, level: 70, category: "Frontend", marketDemand: 92, salaryImpact: 82, connections: ["nextjs", "ts"] },
  { id: "node", label: "Node.js", x: 420, y: 120, level: 65, category: "Backend", marketDemand: 88, salaryImpact: 78, connections: ["ts", "postgres"] },
  { id: "ts", label: "TypeScript", x: 300, y: 100, level: 60, category: "Frontend", marketDemand: 90, salaryImpact: 85, connections: [] },
  { id: "nextjs", label: "Next.js", x: 160, y: 200, level: 55, category: "Frontend", marketDemand: 85, salaryImpact: 80, connections: ["react"] },
  { id: "python", label: "Python", x: 500, y: 280, level: 50, category: "Data", marketDemand: 93, salaryImpact: 88, connections: ["ml", "postgres"] },
  { id: "ml", label: "Machine Learning", x: 600, y: 200, level: 30, category: "AI/ML", marketDemand: 97, salaryImpact: 95, connections: [] },
  { id: "postgres", label: "PostgreSQL", x: 420, y: 300, level: 55, category: "Backend", marketDemand: 80, salaryImpact: 70, connections: ["node"] },
  { id: "docker", label: "Docker", x: 550, y: 380, level: 40, category: "DevOps", marketDemand: 82, salaryImpact: 75, connections: ["aws"] },
  { id: "aws", label: "AWS", x: 650, y: 350, level: 25, category: "DevOps", marketDemand: 91, salaryImpact: 90, connections: [] },
  { id: "git", label: "Git", x: 200, y: 320, level: 80, category: "Tools", marketDemand: 75, salaryImpact: 50, connections: ["js", "docker"] },
  { id: "css", label: "CSS/Tailwind", x: 130, y: 280, level: 75, category: "Frontend", marketDemand: 78, salaryImpact: 60, connections: ["react", "js"] },
  { id: "sql", label: "SQL", x: 350, y: 380, level: 45, category: "Backend", marketDemand: 77, salaryImpact: 65, connections: ["postgres"] },
  { id: "java", label: "Java", x: 520, y: 150, level: 35, category: "Backend", marketDemand: 79, salaryImpact: 82, connections: ["ts"] },
  { id: "figma", label: "Figma", x: 100, y: 180, level: 40, category: "Design", marketDemand: 65, salaryImpact: 55, connections: ["css"] },
];

const CAREER_PATHS: CareerPath[] = [
  { id: "frontend", title: "Frontend Engineer", fit: 82, salary: "₹8-18 LPA", growth: "High", automationRisk: 15 },
  { id: "fullstack", title: "Full Stack Developer", fit: 75, salary: "₹10-22 LPA", growth: "High", automationRisk: 12 },
  { id: "ml", title: "ML Engineer", fit: 45, salary: "₹15-35 LPA", growth: "Very High", automationRisk: 8 },
  { id: "devops", title: "DevOps Engineer", fit: 38, salary: "₹12-28 LPA", growth: "High", automationRisk: 10 },
  { id: "data", title: "Data Analyst", fit: 52, salary: "₹6-14 LPA", growth: "Medium", automationRisk: 25 },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Frontend": "#818cf8",
  "Backend": "#34d399",
  "Data": "#fbbf24",
  "AI/ML": "#f472b6",
  "DevOps": "#a78bfa",
  "Tools": "#64748b",
  "Design": "#fb923c",
};

const CATEGORY_COLORS_BG: Record<string, string> = {
  "Frontend": "rgba(129,140,248,0.15)",
  "Backend": "rgba(52,211,153,0.15)",
  "Data": "rgba(251,191,36,0.15)",
  "AI/ML": "rgba(244,114,182,0.15)",
  "DevOps": "rgba(167,139,250,0.15)",
  "Tools": "rgba(100,116,139,0.15)",
  "Design": "rgba(251,146,60,0.15)",
};

export default function DigitalTwinPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"skills" | "career">("skills");
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error || !d.onboarded) { router.push("/"); return; }
      setAuthed(true);
    }).catch(() => router.push("/"));
  }, [router]);

  const connectedNodes = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    return new Set(selectedNode.connections);
  }, [selectedNode]);

  const overallScore = useMemo(() => {
    const avg = SKILL_NODES.reduce((sum, n) => sum + n.level, 0) / SKILL_NODES.length;
    return Math.round(avg);
  }, []);

  const marketFit = useMemo(() => {
    const avg = SKILL_NODES.reduce((sum, n) => sum + n.marketDemand, 0) / SKILL_NODES.length;
    return Math.round(avg);
  }, []);

  if (!authed) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 py-3 border-b border-white/5 flex items-center justify-between" style={{ background: "rgba(17,17,24,0.5)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="font-bold">Career Digital Twin</h1>
            <p className="text-[10px] text-slate-500">Your skills as a living constellation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(["skills", "career"] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                viewMode === mode ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-slate-500 hover:text-white"
              }`}
            >
              {mode === "skills" ? "Skill Map" : "Career Paths"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Visualization */}
        <div className="flex-1 relative overflow-hidden">
          {viewMode === "skills" ? (
            /* Skill Constellation */
            <svg viewBox="0 0 750 500" className="w-full h-full">
              <defs>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Connections */}
              {SKILL_NODES.map(node =>
                node.connections.map(connId => {
                  const target = SKILL_NODES.find(n => n.id === connId);
                  if (!target) return null;
                  const isHighlighted = selectedNode && (node.id === selectedNode.id || connId === selectedNode.id);
                  const isDimmed = selectedNode && !isHighlighted;
                  return (
                    <line
                      key={`${node.id}-${connId}`}
                      x1={node.x} y1={node.y}
                      x2={target.x} y2={target.y}
                      stroke={isHighlighted ? "#818cf8" : "rgba(255,255,255,0.06)"}
                      strokeWidth={isHighlighted ? 2 : 1}
                      opacity={isDimmed ? 0.2 : 1}
                    />
                  );
                })
              )}

              {/* Nodes */}
              {SKILL_NODES.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const isConnected = connectedNodes.has(node.id);
                const isDimmed = selectedNode && !isSelected && !isConnected;
                const radius = 12 + (node.level / 100) * 18;
                const color = CATEGORY_COLORS[node.category] || "#818cf8";

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(isSelected ? null : node)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Glow ring */}
                    {(isSelected || hoveredNode === node.id) && (
                      <circle cx={node.x} cy={node.y} r={radius + 12} fill="none" stroke={color} strokeWidth="1" opacity="0.3">
                        <animate attributeName="r" values={`${radius + 8};${radius + 16};${radius + 8}`} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Level ring */}
                    <circle
                      cx={node.x} cy={node.y} r={radius + 4}
                      fill="none" stroke={color} strokeWidth="1.5"
                      strokeDasharray={`${(node.level / 100) * Math.PI * (radius + 4) * 2} ${Math.PI * (radius + 4) * 2}`}
                      opacity={isDimmed ? 0.15 : 0.5}
                      transform={`rotate(-90 ${node.x} ${node.y})`}
                    />

                    {/* Node */}
                    <circle
                      cx={node.x} cy={node.y} r={radius}
                      fill={isSelected ? color : CATEGORY_COLORS_BG[node.category]}
                      stroke={color}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      opacity={isDimmed ? 0.2 : 1}
                    />

                    {/* Label */}
                    <text
                      x={node.x} y={node.y + radius + 14}
                      textAnchor="middle"
                      fill={isDimmed ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.7)"}
                      fontSize="10"
                      fontWeight={isSelected ? "bold" : "normal"}
                    >
                      {node.label}
                    </text>

                    {/* Level number */}
                    <text
                      x={node.x} y={node.y + 4}
                      textAnchor="middle"
                      fill={isDimmed ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.9)"}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {node.level}
                    </text>
                  </g>
                );
              })}
            </svg>
          ) : (
            /* Career Paths */
            <div className="p-6 overflow-y-auto h-full">
              <div className="max-w-2xl mx-auto space-y-3">
                {CAREER_PATHS.sort((a, b) => b.fit - a.fit).map((path, i) => (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPath?.id === path.id
                        ? "border-indigo-500/30 bg-indigo-500/5"
                        : "border-white/5 bg-white/[0.02] hover:border-white/10"
                    }`}
                    onClick={() => setSelectedPath(selectedPath?.id === path.id ? null : path)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center relative">
                        <span className="text-xl font-bold text-indigo-400">{path.fit}</span>
                        <span className="absolute -top-1 -right-1 text-[8px] text-slate-500">%</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{path.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{path.salary} · {path.growth} growth</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500">Automation</div>
                          <div className={`text-sm font-bold ${path.automationRisk > 20 ? "text-amber-400" : "text-green-400"}`}>
                            {path.automationRisk}%
                          </div>
                        </div>
                        <Shield className={`w-4 h-4 ${path.automationRisk > 20 ? "text-amber-400" : "text-green-400"}`} />
                      </div>
                    </div>

                    {/* Fit bar */}
                    <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${path.fit}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, #6366f1, #a78bfa)` }}
                      />
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {selectedPath?.id === path.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 mt-3 border-t border-white/5 grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <div className="text-[10px] text-slate-500">Skill Match</div>
                              <div className="text-sm font-bold text-indigo-400">{path.fit}%</div>
                            </div>
                            <div className="text-center">
                              <div className="text-[10px] text-slate-500">Salary Range</div>
                              <div className="text-sm font-bold text-emerald-400">{path.salary}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-[10px] text-slate-500">Safety Score</div>
                              <div className="text-sm font-bold text-green-400">{100 - path.automationRisk}%</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Floating stats */}
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="px-3 py-2 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm">
              <div className="text-[10px] text-slate-500">Overall Skill Score</div>
              <div className="text-lg font-bold gradient-text">{overallScore}</div>
            </div>
            <div className="px-3 py-2 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm">
              <div className="text-[10px] text-slate-500">Market Fit</div>
              <div className="text-lg font-bold text-emerald-400">{marketFit}%</div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="shrink-0 border-l border-white/5 overflow-y-auto"
              style={{ background: "rgba(17,17,24,0.5)" }}
            >
              <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                    style={{ background: CATEGORY_COLORS_BG[selectedNode.category], color: CATEGORY_COLORS[selectedNode.category] }}
                  >
                    {selectedNode.level}
                  </div>
                  <div>
                    <h2 className="font-bold">{selectedNode.label}</h2>
                    <div className="text-xs text-slate-500">{selectedNode.category}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Proficiency */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Proficiency</span>
                      <span className="text-white font-medium">{selectedNode.level}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.level}%` }}
                        className="h-full rounded-full"
                        style={{ background: CATEGORY_COLORS[selectedNode.category] }}
                      />
                    </div>
                  </div>

                  {/* Market Demand */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Market Demand</span>
                      <span className="text-white font-medium">{selectedNode.marketDemand}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.marketDemand}%` }}
                        className="h-full rounded-full bg-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Salary Impact */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Salary Impact</span>
                      <span className="text-white font-medium">{selectedNode.salaryImpact}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.salaryImpact}%` }}
                        className="h-full rounded-full bg-amber-500"
                      />
                    </div>
                  </div>

                  {/* Connections */}
                  <div>
                    <div className="text-xs text-slate-400 mb-2">Connected Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.connections.map(connId => {
                        const conn = SKILL_NODES.find(n => n.id === connId);
                        if (!conn) return null;
                        return (
                          <button
                            key={connId}
                            onClick={() => setSelectedNode(conn)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:border-indigo-500/30 transition-colors"
                          >
                            {conn.label}
                          </button>
                        );
                      })}
                      {selectedNode.connections.length === 0 && (
                        <span className="text-xs text-slate-600">No connections</span>
                      )}
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-medium text-indigo-400">AI Insight</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {selectedNode.level > 70
                        ? `Strong ${selectedNode.label} skills. Consider mentoring others or specializing deeper.`
                        : selectedNode.marketDemand > 85
                          ? `High market demand for ${selectedNode.label}. Investing here will boost your job prospects significantly.`
                          : `${selectedNode.label} is a solid skill to have. Focus on practical projects to level up.`}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="shrink-0 px-6 py-2 border-t border-white/5 flex items-center gap-4 text-[10px] text-slate-500 overflow-x-auto">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}
