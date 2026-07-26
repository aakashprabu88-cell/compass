"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Target, TrendingUp, AlertTriangle, Sparkles, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { SKILL_GRAPH_EDGES, CATEGORY_COLORS, updateSkillLevels, getSkillStats, type SkillNode } from "@/lib/skill-graph";

export default function SkillGraphPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [selected, setSelected] = useState<SkillNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/login"); return; }
        const data = await res.json();
        if (!data || data.error) { router.push("/login"); return; }
        if (!data.onboarded) { router.push("/onboarding"); return; }
        setUser(data);

        const [skillsRes, gapsRes] = await Promise.all([
          fetch("/api/skills").then(r => r.ok ? r.json() : []).catch(() => []),
          fetch("/api/skills").then(r => r.ok ? r.json() : []).catch(() => []),
        ]);

        const userSkills = JSON.parse(localStorage.getItem("compass_career_advice") || "{}")?.recommendedPaths?.map((p: any) => p.title) || [];
        const skillNames = Array.isArray(skillsRes) ? skillsRes.map((s: any) => s.skillName) : [];
        const gaps = Array.isArray(gapsRes) ? gapsRes : [];

        setNodes(updateSkillLevels([...skillNames, ...userSkills], gaps));
      } catch { router.push("/login"); }
    }
    load();
  }, [router]);

  const stats = getSkillStats(nodes);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as SVGElement).tagName === "rect") {
      setDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }, [dragging, dragStart]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const connectedTo = selected ? SKILL_GRAPH_EDGES.filter(e => e.from === selected.id || e.to === selected.id).map(e => e.from === selected.id ? e.to : e.from) : [];

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/5 p-4 flex items-center justify-between shrink-0" style={{ background: "rgba(17,17,24,0.3)" }}>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2"><Target className="w-5 h-5 text-indigo-400" /> Skill Graph</h1>
            <p className="text-xs text-slate-500">Interactive map of your skills, gaps, and learning paths</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><ZoomIn className="w-4 h-4" /></button>
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.3))} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><ZoomOut className="w-4 h-4" /></button>
            <button onClick={resetView} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><RotateCcw className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Graph */}
          <div className="flex-1 relative overflow-hidden" style={{ cursor: dragging ? "grabbing" : "grab" }}>
            <svg
              ref={svgRef}
              className="w-full h-full"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <defs>
                <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <filter id="glow-strong"><feGaussianBlur stdDeviation="6" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
                {/* Edges */}
                {SKILL_GRAPH_EDGES.map((edge, i) => {
                  const from = nodes.find(n => n.id === edge.from);
                  const to = nodes.find(n => n.id === edge.to);
                  if (!from || !to) return null;
                  const isHighlighted = selected && (edge.from === selected.id || edge.to === selected.id);
                  const fromMastered = from.status === "mastered";
                  const toMastered = to.status === "mastered";
                  const bothMastered = fromMastered && toMastered;
                  return (
                    <line
                      key={i}
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke={isHighlighted ? "#818cf8" : bothMastered ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"}
                      strokeWidth={isHighlighted ? 2 : 1}
                      strokeDasharray={edge.type === "prerequisite" ? "none" : "4,4"}
                      opacity={selected && !isHighlighted ? 0.2 : 1}
                    />
                  );
                })}

                {/* Nodes */}
                {nodes.map(node => {
                  const colors = CATEGORY_COLORS[node.category] || CATEGORY_COLORS["Tools"];
                  const isSelected = selected?.id === node.id;
                  const isConnected = connectedTo.includes(node.id);
                  const dimmed = selected && !isSelected && !isConnected;
                  const radius = node.status === "mastered" ? 22 : node.status === "gap" && node.demand === "high" ? 20 : 16;
                  return (
                    <g
                      key={node.id}
                      onClick={(e) => { e.stopPropagation(); setSelected(isSelected ? null : node); }}
                      style={{ cursor: "pointer", opacity: dimmed ? 0.2 : 1, transition: "opacity 0.3s" }}
                    >
                      {/* Glow for mastered */}
                      {node.status === "mastered" && (
                        <circle cx={node.x} cy={node.y} r={radius + 8} fill={colors.glow} opacity={0.3} filter="url(#glow)" />
                      )}
                      {/* Gap pulse */}
                      {node.status === "gap" && node.demand === "high" && (
                        <circle cx={node.x} cy={node.y} r={radius + 5} fill="none" stroke={colors.border} strokeWidth={1} opacity={0.5}>
                          <animate attributeName="r" from={radius + 3} to={radius + 12} dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {/* Node circle */}
                      <circle
                        cx={node.x} cy={node.y} r={radius}
                        fill={node.status === "mastered" ? colors.bg : "rgba(255,255,255,0.03)"}
                        stroke={isSelected ? "#818cf8" : colors.border}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        filter={isSelected ? "url(#glow-strong)" : "none"}
                        style={{ transition: "all 0.3s" }}
                      />
                      {/* Level indicator */}
                      {node.level > 0 && node.status !== "mastered" && (
                        <circle cx={node.x} cy={node.y} r={radius} fill="none" stroke={colors.text} strokeWidth={2}
                          strokeDasharray={`${(node.level / 10) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`}
                          transform={`rotate(-90 ${node.x} ${node.y})`} opacity={0.6} />
                      )}
                      {/* Label */}
                      <text x={node.x} y={node.y + radius + 14} textAnchor="middle"
                        fill={isSelected ? "#fff" : dimmed ? "#475569" : colors.text}
                        fontSize={10} fontWeight={isSelected ? 600 : 400}
                        style={{ transition: "fill 0.3s", pointerEvents: "none" }}>
                        {node.label}
                      </text>
                      {/* Status icon */}
                      {node.status === "mastered" && (
                        <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize={12} fill={colors.text}>✓</text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Side Panel */}
          <div className="w-80 border-l border-white/5 p-4 overflow-y-auto shrink-0" style={{ background: "rgba(17,17,24,0.3)" }}>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-xl font-bold text-green-400">{stats.mastered}</div>
                <div className="text-[10px] text-slate-500 uppercase">Mastered</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-xl font-bold text-red-400">{stats.gaps}</div>
                <div className="text-[10px] text-slate-500 uppercase">Gaps</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-xl font-bold text-indigo-400">+{stats.totalSalaryBoost}%</div>
                <div className="text-[10px] text-slate-500 uppercase">Salary Boost</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-xl font-bold text-amber-400">+{stats.potentialBoost}%</div>
                <div className="text-[10px] text-slate-500 uppercase">Potential</div>
              </div>
            </div>

            {/* Legend */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Categories</h3>
              <div className="space-y-1.5">
                {Object.entries(CATEGORY_COLORS).map(([cat, colors]) => (
                  <div key={cat} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: colors.bg, border: `1px solid ${colors.border}` }} />
                    <span className="text-xs text-slate-400">{cat}</span>
                    <span className="text-[10px] text-slate-600 ml-auto">{nodes.filter(n => n.category === cat).length}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Node Details */}
            {selected ? (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{selected.label}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      selected.status === "mastered" ? "bg-green-500/10 text-green-400" :
                      selected.status === "gap" ? "bg-red-500/10 text-red-400" :
                      "bg-slate-500/10 text-slate-400"
                    }`}>
                      {selected.status === "mastered" ? "Mastered" : selected.status === "gap" ? "Skill Gap" : "Learning"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-3">{selected.category}</div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Level</span>
                      <span className="font-medium">{selected.level}/10</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: `${selected.level * 10}%` }} />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Market Demand</span>
                      <span className={`font-medium ${selected.demand === "high" ? "text-green-400" : selected.demand === "medium" ? "text-yellow-400" : "text-slate-400"}`}>
                        {selected.demand.charAt(0).toUpperCase() + selected.demand.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Salary Impact</span>
                      <span className="font-medium text-indigo-400">+{selected.salaryImpact}%</span>
                    </div>
                  </div>
                </div>

                {/* Connected Skills */}
                {connectedTo.length > 0 && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Connected Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {connectedTo.map(id => {
                        const n = nodes.find(x => x.id === id);
                        if (!n) return null;
                        const c = CATEGORY_COLORS[n.category];
                        return (
                          <button key={id} onClick={() => setSelected(n)}
                            className="px-2 py-1 rounded-lg text-[10px] border transition-all hover:scale-105"
                            style={{ background: c.bg, borderColor: c.border, color: c.text }}>
                            {n.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-xs text-slate-500">Click a skill node to see details, connections, and learning recommendations</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
