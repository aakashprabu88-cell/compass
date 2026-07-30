"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Code2, Monitor, Server, Database, Cpu, Shield, Cloud, Palette, BarChart3, Smartphone, Gamepad2, Braces, GitBranch, Layout, Globe, ChevronRight, Laptop, Terminal } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const ROLES = [
  { id: "frontend", icon: Monitor, title: "Frontend Developer", desc: "React, Next.js, HTML/CSS, JavaScript, TypeScript, UI/UX principles.", color: "rgba(99,102,241,0.15)" },
  { id: "backend", icon: Server, title: "Backend Developer", desc: "Node.js, Python, Java, APIs, microservices, databases, authentication.", color: "rgba(168,85,247,0.15)" },
  { id: "fullstack", icon: Layout, title: "Full Stack Developer", desc: "Frontend + backend, DevOps basics, deployment, and system design.", color: "rgba(6,182,212,0.15)" },
  { id: "ai-engineer", icon: Cpu, title: "AI/ML Engineer", desc: "Machine learning, deep learning, NLP, computer vision, LLMs, MLOps.", color: "rgba(244,63,94,0.15)" },
  { id: "cybersecurity", icon: Shield, title: "Cyber Security", desc: "Network security, cryptography, ethical hacking, compliance, SOC.", color: "rgba(16,185,129,0.15)" },
  { id: "cloud", icon: Cloud, title: "Cloud Engineer", desc: "AWS, Azure, GCP, Kubernetes, Docker, CI/CD, infrastructure as code.", color: "rgba(245,158,11,0.15)" },
  { id: "devops", icon: Terminal, title: "DevOps Engineer", desc: "CI/CD pipelines, containerization, monitoring, automation, SRE.", color: "rgba(99,102,241,0.15)" },
  { id: "ui-ux", icon: Palette, title: "UI/UX Designer", desc: "Design systems, Figma, user research, prototyping, accessibility.", color: "rgba(168,85,247,0.15)" },
  { id: "data-analyst", icon: BarChart3, title: "Data Analyst", desc: "SQL, Excel, Python, Tableau, statistics, business intelligence.", color: "rgba(6,182,212,0.15)" },
  { id: "data-engineer", icon: Database, title: "Data Engineer", desc: "ETL pipelines, data warehouses, Spark, Kafka, big data technologies.", color: "rgba(244,63,94,0.15)" },
  { id: "android", icon: Smartphone, title: "Android Developer", desc: "Kotlin, Jetpack, Compose, MVVM, Material Design, Play Store.", color: "rgba(16,185,129,0.15)" },
  { id: "ios", icon: Globe, title: "iOS Developer", desc: "Swift, SwiftUI, UIKit, Core Data, App Store, Combine.", color: "rgba(245,158,11,0.15)" },
  { id: "game-dev", icon: Gamepad2, title: "Game Developer", desc: "Unity, Unreal, C#, C++, 3D modeling, game physics, rendering.", color: "rgba(99,102,241,0.15)" },
  { id: "software-engineer", icon: Laptop, title: "Software Engineer (Core)", desc: "DSA, OOP, system design, databases, networks, OS fundamentals.", color: "rgba(168,85,247,0.15)" },
];

const CORE_TOPICS = [
  { id: "dsa", icon: Braces, title: "Data Structures & Algorithms", desc: "Arrays, linked lists, trees, graphs, DP, sorting, searching.", color: "rgba(99,102,241,0.15)" },
  { id: "system-design", icon: GitBranch, title: "System Design", desc: "Scalability, load balancing, caching, microservices, databases.", color: "rgba(168,85,247,0.15)" },
  { id: "os", icon: Monitor, title: "Operating Systems", desc: "Processes, memory management, scheduling, file systems, concurrency.", color: "rgba(6,182,212,0.15)" },
  { id: "dbms", icon: Database, title: "DBMS & SQL", desc: "Normalization, indexing, queries, transactions, NoSQL, optimization.", color: "rgba(244,63,94,0.15)" },
  { id: "networks", icon: Globe, title: "Computer Networks", desc: "TCP/IP, HTTP, DNS, routing, security, OSI model, protocols.", color: "rgba(16,185,129,0.15)" },
  { id: "oops", icon: Code2, title: "OOPS Concepts", desc: "Encapsulation, inheritance, polymorphism, design patterns.", color: "rgba(245,158,11,0.15)" },
];

export default function TechnicalPage() {
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
      } catch (e) { console.error("technical load", e); if (!cancelled) router.push("/"); }
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

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Technical Interview</h1>
                <p className="text-sm text-slate-400">Role-specific technical preparation with coding, system design, and core concepts</p>
              </div>
            </div>
          </motion.div>

          {/* Core CS Topics */}
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Core Computer Science</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {CORE_TOPICS.map((topic, i) => {
              const topicLink
                = topic.id === "dsa" ? "/interview-preparation/aptitude/number-system"
                : topic.id === "system-design" ? "/interview-preparation/company/google"
                : topic.id === "os" ? "/interview-preparation/company/microsoft"
                : topic.id === "dbms" ? "/interview-preparation/company/oracle"
                : topic.id === "networks" ? "/interview-preparation/company/google"
                : topic.id === "oops" ? "/interview-preparation/company/microsoft"
                : "/interview-preparation/aptitude";
              return (
                <motion.div key={topic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 * i }}>
                  <Link href={topicLink}
                    className="group block p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
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
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Roles */}
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Select Your Role</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROLES.map((role, i) => {
              const roleLink
                = role.id === "frontend" ? "/interview-preparation/company/google"
                : role.id === "backend" ? "/interview-preparation/company/amazon"
                : role.id === "fullstack" ? "/interview-preparation/company/microsoft"
                : role.id === "ai-engineer" ? "/interview-preparation/company/google"
                : role.id === "cybersecurity" ? "/interview-preparation/company/google"
                : role.id === "cloud" || role.id === "devops" ? "/interview-preparation/company/amazon"
                : role.id === "ui-ux" ? "/interview-preparation/company/apple"
                : role.id === "data-analyst" || role.id === "data-engineer" ? "/interview-preparation/company/google"
                : role.id === "android" ? "/interview-preparation/company/google"
                : role.id === "ios" ? "/interview-preparation/company/apple"
                : role.id === "game-dev" ? "/interview-preparation/company/meta"
                : role.id === "software-engineer" ? "/interview-preparation/company/microsoft"
                : "/interview-preparation/aptitude";
              return (
                <motion.div key={role.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.015 * i }}>
                  <Link href={roleLink}
                    className="group block p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                    style={{ background: "rgba(17,17,24,0.5)" }}>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: role.color }}>
                        <role.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="font-semibold text-sm">{role.title}</h3>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                        </div>
                        <p className="text-xs text-slate-500">{role.desc}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
