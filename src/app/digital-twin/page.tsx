"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Target, TrendingUp, Star, Zap, Shield,
  ChevronRight, ArrowUpRight, Layers, Eye, Sparkles
} from "lucide-react";
import {
  SKILL_NODES, CAREER_PATHS, CATEGORY_COLORS, CATEGORY_COLORS_BG,
  type SkillNode, type CareerPath
} from "@/data/skill-nodes";

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

      {/* Body */}
      <div className="flex-1 overflow-hidden flex">
        {viewMode === "skills" ? (
          <>
            {/* Skill Graph */}
            <div className="flex-1 relative overflow-hidden">
              {/* Background grid */}
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.03 }}>
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              <svg className="w-full h-full" viewBox="0 0 780 480">
                {/* Connection lines */}
                {SKILL_NODES.map(node =>
                  node.connections.map(targetId => {
                    const target = SKILL_NODES.find(n => n.id === targetId);
                    if (!target) return null;
                    const isHighlighted = selectedNode && (node.id === selectedNode.id || target.id === selectedNode.id || connectedNodes.has(node.id));
                    return (
                      <line
                        key={`${node.id}-${targetId}`}
                        x1={node.x} y1={node.y}
                        x2={target.x} y2={target.y}
                        stroke={isHighlighted ? CATEGORY_COLORS[node.category] : "rgba(255,255,255,0.06)"}
                        strokeWidth={isHighlighted ? 2 : 1}
                      />
                    );
                  })
                )}

                {/* Nodes */}
                {SKILL_NODES.map(node => {
                  const isSelected = selectedNode?.id === node.id;
                  const isConnected = selectedNode && connectedNodes.has(node.id);
                  const opacity = !selectedNode || isSelected || isConnected ? 1 : 0.2;

                  return (
                    <g key={node.id}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(isSelected ? null : node)}
                      style={{ cursor: "pointer", opacity, transition: "opacity 0.3s" }}
                    >
                      <circle cx={node.x} cy={node.y} r={isSelected ? 28 : 22}
                        fill={CATEGORY_COLORS_BG[node.category]}
                        stroke={isSelected ? CATEGORY_COLORS[node.category] : "rgba(255,255,255,0.1)"}
                        strokeWidth={isSelected ? 2.5 : 1}
                      />
                      <text x={node.x} y={node.y + 4} textAnchor="middle" fill="white"
                        fontSize={isSelected ? 8 : 7} fontWeight="bold">
                        {node.label}
                      </text>
                      {/* Level indicator */}
                      <circle cx={node.x + 18} cy={node.y - 18} r={8}
                        fill={node.level >= 70 ? "rgba(52,211,153,0.3)" : node.level >= 40 ? "rgba(251,191,36,0.3)" : "rgba(248,113,113,0.3)"}
                        stroke={node.level >= 70 ? "#34d399" : node.level >= 40 ? "#fbbf24" : "#f87171"}
                        strokeWidth={1}
                      />
                      <text x={node.x + 18} y={node.y - 14} textAnchor="middle" fill="white" fontSize={6}>
                        {node.level}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                  <div key={cat} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    {cat}
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Detail Panel */}
            <div className="w-72 shrink-0 border-l border-white/5 p-4 overflow-y-auto" style={{ background: "rgba(17,17,24,0.5)" }}>
              {selectedNode ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: CATEGORY_COLORS_BG[selectedNode.category] }}>
                      <Brain className="w-4 h-4" style={{ color: CATEGORY_COLORS[selectedNode.category] }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{selectedNode.label}</h3>
                      <span className="text-[10px] text-slate-500">{selectedNode.category}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Your Level</span>
                        <span className="font-medium">{selectedNode.level}/100</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${selectedNode.level}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Market Demand</span>
                        <span className="font-medium text-green-400">{selectedNode.marketDemand}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-green-500" style={{ width: `${selectedNode.marketDemand}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Salary Impact</span>
                        <span className="font-medium text-amber-400">{selectedNode.salaryImpact}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: `${selectedNode.salaryImpact}%` }} />
                      </div>
                    </div>

                    {selectedNode.connections.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-500 mb-2">Connected Skills</div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedNode.connections.map(connId => {
                            const conn = SKILL_NODES.find(n => n.id === connId);
                            return conn ? (
                              <span key={connId}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                                {conn.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-xs text-slate-500">Click any skill node to see details</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Career Paths View */
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <div className="grid gap-4">
                {CAREER_PATHS.map((path, i) => (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedPath(selectedPath?.id === path.id ? null : path)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      selectedPath?.id === path.id ? "bg-indigo-500/10 border-indigo-500/30" : "bg-white/[0.02] border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{path.title}</h3>
                        <p className="text-xs text-slate-500">Fit: {path.fit}%</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{path.salary}</div>
                        <div className="text-[10px] text-slate-500">{path.growth} growth</div>
                      </div>
                    </div>

                    {selectedPath?.id === path.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        className="overflow-hidden">
                        <div className="border-t border-white/5 pt-3 mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-xs">Automation Risk: {path.automationRisk}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-red-500"
                              style={{ width: `${path.automationRisk}%` }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-center">
                  <div className="text-2xl font-bold text-indigo-400">{overallScore}%</div>
                  <div className="text-[10px] text-slate-500">Overall Skill Level</div>
                </div>
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
                  <div className="text-2xl font-bold text-green-400">{marketFit}%</div>
                  <div className="text-[10px] text-slate-500">Market Fit Score</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
                  <div className="text-2xl font-bold text-purple-400">{CAREER_PATHS.length}</div>
                  <div className="text-[10px] text-slate-500">Career Options</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
