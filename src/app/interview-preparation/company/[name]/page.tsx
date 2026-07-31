"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Briefcase, Star, TrendingUp, Users, ChevronRight, BookOpen, Award, Clock, Globe, Mail, MapPin, Loader2, ExternalLink, Lightbulb, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const COMPANY_INFO: Record<string, { fullName: string; tier: string; hiringProcess: string[]; culture: string; tips: string[] }> = {
  google: {
    fullName: "Google", tier: "FAANG",
    hiringProcess: ["Resume Screen → Phone Interview → On-site (4-5 rounds) → HC → Offer"],
    culture: "Innovation-first, data-driven, collaborative. Known for tough algorithmic interviews.",
    tips: ["Master DSA — Google focuses heavily on algorithms and data structures", "Practice system design for L5+ roles", "Prepare for behavioral questions using Google's 'Googleyness' framework", "Know Google's products and history", "Practice on LeetCode — Google-tagged questions are a goldmine"],
  },
  microsoft: {
    fullName: "Microsoft", tier: "FAANG",
    hiringProcess: ["Phone Screen → Technical Phone → On-site (4 rounds) → AS Review → Offer"],
    culture: "Growth mindset, 'learn-it-all' culture. More emphasis on problem-solving approach than speed.",
    tips: ["Expect more design questions than Google", "Be ready to discuss past projects in-depth", "Microsoft values collaboration — show how you work in teams", "Prepare for 'why Microsoft' — know their products and mission", "Practice explaining your thought process clearly"],
  },
  amazon: {
    fullName: "Amazon", tier: "FAANG",
    hiringProcess: ["Online Assessment → Phone Screen → On-site (4-5 rounds) → Bar Raiser → Offer"],
    culture: "Customer-obsessed, ownership-driven. Leadership Principles are central to every interview.",
    tips: ["Prepare 2-3 STAR stories for each Leadership Principle", "Amazon's Bar Raiser has veto power — prepare well", "Expect LP-focused behavioral questions in EVERY round", "System design interviews focus on scalability", "Practice the 'working backwards' approach"],
  },
  meta: {
    fullName: "Meta", tier: "FAANG",
    hiringProcess: ["Phone Screen → Tech Screen → On-site (4 rounds) → Offer"],
    culture: "Move fast, ship-oriented. Strong engineering culture with focus on product impact.",
    tips: ["Expect at least one coding round in your language of choice", "System design is product-focused (design Instagram, WhatsApp etc.)", "Behavioral questions focus on 'Meta values'", "Prepare for SQL/data engineering questions if applying for relevant roles", "Know Meta's monetization model and products"],
  },
  apple: {
    fullName: "Apple", tier: "FAANG",
    hiringProcess: ["Phone Screen → On-site (5-6 rounds) → Hiring Manager → Offer"],
    culture: "Secrecy-driven, craftsmanship-focused. Values people who take ownership and ship polished products.",
    tips: ["Expect deep-dive questions on every project on your resume", "Apple loves 'design for the user' thinking — show craft and attention to detail", "Prepare for a hardware+software blend of questions for iOS/macOS roles", "Fewer LeetCode-style questions, more real-world engineering problems", "Have strong questions ready — Apple interviewers judge your curiosity"],
  },
  netflix: {
    fullName: "Netflix", tier: "FAANG",
    hiringProcess: ["Hiring Manager Call → Technical Screen → On-site (5 rounds) → Offer"],
    culture: "Freedom and responsibility. High-performance culture — 'adequate performance gets a generous severance'.",
    tips: ["Be ready to discuss what you'd do differently in your past projects", "Netflix values candor — communicate directly and honestly", "Expect opinionated questions about system design trade-offs", "Show self-direction — Netflix hires senior, independent engineers", "Know Netflix's culture deck — it is the interview rubric"],
  },
  nvidia: {
    fullName: "NVIDIA", tier: "Semiconductor",
    hiringProcess: ["OA (coding + ML) → Technical Screen → On-site (4-5 rounds) → Offer"],
    culture: "AI-first, deeply technical. Teams work on CUDA, GPU architecture, and ML frameworks.",
    tips: ["Expect CUDA/C++ and parallel-programming questions for engineering roles", "ML roles test PyTorch internals, transformer math, and model optimization", "Practice matrix-multiplication and performance-analysis problems", "Know NVIDIA's product stack — Hopper, Blackwell, CUDA, cuDNN", "Show hands-on GPU experimentation — it differentiates candidates"],
  },
  adobe: {
    fullName: "Adobe", tier: "Product",
    hiringProcess: ["Resume Screen → Technical Screen → On-site (4 rounds) → Offer"],
    culture: "Creativity-at-scale. 'Adobe for All' culture with focus on inclusive design and creator tools.",
    tips: ["Expect design-system and frontend-heavy questions for UI roles", "Product rounds test how you'd improve Photoshop/Premiere for millions of creators", "Be ready to walk through your portfolio projects in depth", "Adobe values simplicity — show you can reduce complexity", "Know Adobe's shift to cloud (Creative Cloud, Firefly)"],
  },
  oracle: {
    fullName: "Oracle", tier: "Product",
    hiringProcess: ["Online Test → Technical Round → Managerial → HR → Offer"],
    culture: "Enterprise-first, database-centric. Strong in cloud infrastructure and autonomous databases.",
    tips: ["SQL questions are almost guaranteed — practice joins, indexes, query optimization", "Expect Java-heavy questions for backend roles", "Know OCI (Oracle Cloud Infrastructure) basics", "Practice system design for enterprise-scale data systems", "Show willingness to work with legacy systems that power global banks"],
  },
  salesforce: {
    fullName: "Salesforce", tier: "Product",
    hiringProcess: ["Recruiter Screen → Technical Phone → On-site (4 rounds) → Offer"],
    culture: "'Ohana' culture — family-first, trust-driven. Cloud CRM leader.",
    tips: ["Expect Apex and declarative platform questions for admin/dev roles", "Product rounds test customer-obsession and platform design", "Know Salesforce's trust model and multi-tenant architecture", "Show alignment with the Ohana values — community and equality", "Practice questions on scaling multi-tenant SaaS"],
  },
  atlassian: {
    fullName: "Atlassian", tier: "Product",
    hiringProcess: ["Karat Technical Screen → On-site (4 rounds) → Offer"],
    culture: "'Play, then Win' — values team-first collaboration. Known for Jira and Confluence.",
    tips: ["Atlassian uses Karat interviews — practice clear communication while coding", "Expect product-sense questions around developer tools", "Show teamwork stories — 'Don't #@!% the customer' is a core value", "Be ready to explain trade-offs between speed and quality", "Know the Atlassian product ecosystem"],
  },
  uber: {
    fullName: "Uber", tier: "Product",
    hiringProcess: ["Technical Screen → On-site (4-5 rounds) → Offer"],
    culture: "Operational excellence, real-time systems. 'Customer obsession' with a marketplace mindset.",
    tips: ["Expect geospatial and real-time system design (matching, dispatch)", "Practice design of location-based systems and event-driven architecture", "Uber values 'Let's build' — show bias for action", "Behavioral rounds use Uber's cultural values", "Know the Uber marketplace dynamics — supply vs. demand"],
  },
  flipkart: {
    fullName: "Flipkart", tier: "Product",
    hiringProcess: ["Online Test → Machine Coding → DS/Algo Rounds → Hiring Manager → HR → Offer"],
    culture: "Indian e-commerce leader. Fast-paced, startup heritage with 'Flipkart First' customer focus.",
    tips: ["Machine-coding round is mandatory — build a small system in 90 minutes", "Expect high-volume e-commerce system design (cart, search, recommendations)", "Practice DSA thoroughly — 2 rounds of DS/Algo", "Prepare 'flipkart chai pe charcha' HR rounds — culture questions", "Show understanding of India-first customer problems"],
  },
  swiggy: {
    fullName: "Swiggy", tier: "Product",
    hiringProcess: ["Phone Screen → DSA Round → System Design → Hiring Manager → Offer"],
    culture: "Fast-food delivery, faster engineering. Highly data-driven with logistics at its core.",
    tips: ["Expect system design around delivery logistics, ETAs, and live tracking", "DSA rounds cover standard algorithms with a practical bent", "Swiggy values product-thinking — know how recommendations and discounts work", "Show hunger to build — startup-like execution mindset", "Research Swiggy's core platform problems and their blog posts"],
  },
  zomato: {
    fullName: "Zomato", tier: "Product",
    hiringProcess: ["Online Test → Technical Rounds → System Design → Culture Fit → Offer"],
    culture: "Restaurant discovery + delivery. Aggressive, product-first culture with a strong brand voice.",
    tips: ["Expect design questions around discovery, search, and ordering flows", "Practice geolocation-heavy system design (restaurant ranking by distance)", "Zomato tests how you prioritize under constraints", "Know their monetization — ads, delivery fee, Gold membership", "Show data-driven decision making in your answers"],
  },
  paytm: {
    fullName: "Paytm", tier: "Product",
    hiringProcess: ["Online Assessment → Technical Rounds → Managerial → HR → Offer"],
    culture: "Fintech scale — payments, wallets, and financial services. High-volume transaction systems.",
    tips: ["Expect questions on high-throughput, low-latency payment systems", "Practice idempotency, distributed transactions, and consistency models", "Paytm values speed — prepare for fast-paced coding rounds", "Show understanding of UPI, wallets, and merchant onboarding", "Be ready for 'how would you handle scale' design questions"],
  },
  razorpay: {
    fullName: "Razorpay", tier: "Product",
    hiringProcess: ["Recruiter Screen → Coding Round → System Design → Hiring Manager → Offer"],
    culture: "Developer-first payments. High engineering standards with strong open-source presence.",
    tips: ["Expect rigorous system design around payment orchestration and reconciliation", "Coding rounds lean into API design and clean architecture", "Razorpay hires for engineering excellence — show deep fundamentals", "Know how payment gateways, PG-as-a-service, and refunds work", "Prepare to discuss failure handling — payments must never lose data"],
  },
  phonepe: {
    fullName: "PhonePe", tier: "Product",
    hiringProcess: ["Online Test → Technical Rounds → System Design → HR → Offer"],
    culture: "UPI-era fintech. Massive scale on the India Stack — payments on UPI rails.",
    tips: ["Expect UPI and payment-rail system design questions", "Practice handling scale — PhonePe processes billions of transactions", "Show understanding of the India Stack (UPI, Aadhaar, DigiLocker)", "Backend roles test Java/Go and high-availability patterns", "Know PhonePe's merchant and P2P product lines"],
  },
  infosys: {
    fullName: "Infosys", tier: "Service",
    hiringProcess: ["Online Test → Technical Interview → HR Interview → Offer"],
    culture: "Process-driven, learning-oriented. One of India's largest IT services companies.",
    tips: ["Focus on basics: DSA, DBMS, OOP, OS fundamentals", "Prepare for aptitude and logical reasoning tests", "Communication skills matter — practice in English", "Know about recent Infosys projects and acquisitions", "Be ready to explain your academic projects"],
  },
  tcs: {
    fullName: "TCS", tier: "Service",
    hiringProcess: ["TCS NQT → Technical Interview → Managerial → HR → Offer"],
    culture: "Structured, process-heavy. Massive training infrastructure for freshers.",
    tips: ["TCS NQT has aptitude, logical, and verbal sections — practice all three", "Technical interview covers basics of CS fundamentals", "Prepare for 'why TCS' and long-term career questions", "Be honest about your skills — TCS values integrity", "Communication and attitude matter a lot"],
  },
  wipro: {
    fullName: "Wipro", tier: "Service",
    hiringProcess: ["Online Test → Technical Interview → HR → Offer"],
    culture: "Diverse, innovation-focused. Strong in digital transformation and consulting.",
    tips: ["Prepare for their online assessment — aptitude + coding", "Technical interview covers projects and fundamentals", "Wipro values adaptability and willingness to learn", "Be ready to relocate — Wipro has global projects", "Show passion for technology and problem-solving"],
  },
  accenture: {
    fullName: "Accenture", tier: "Service",
    hiringProcess: ["Cognitive Assessment → Technical → HR → Offer"],
    culture: "Consulting-driven, diverse. Strong focus on continuous learning and innovation.",
    tips: ["Accenture's cognitive assessment tests English, reasoning, and math", "Technical questions are moderate difficulty", "Consulting mindset — show problem-solving and client-first attitude", "Prepare for 'tell me about yourself' and situational questions", "Accenture values diversity and inclusion — demonstrate awareness"],
  },
  capgemini: {
    fullName: "Capgemini", tier: "Service",
    hiringProcess: ["Online Test (AMCAT-style) → Technical Interview → HR → Offer"],
    culture: "French-origin global IT services. 'Get the Future You Want' — strong learning culture.",
    tips: ["Online test covers aptitude, English, and technical MCQs", "Technical round goes through projects and CS fundamentals", "Expect a coding question in the technical round", "Show flexibility with tech stacks and domains", "Capgemini values continuous learning — mention certifications"],
  },
  cognizant: {
    fullName: "Cognizant (CTS)", tier: "Service",
    hiringProcess: ["Online Assessment → Technical Interview → HR → Offer"],
    culture: "Consulting + technology services. Known for hiring in big volumes and upskilling.",
    tips: ["Assessment has aptitude, logical reasoning, and programming MCQs", "Technical interview covers OOP, DBMS, and your projects", "Be ready to work across domains — CTS is multi-industry", "Practice communication — clients are global", "Show eagerness to learn new technologies"],
  },
  deloitte: {
    fullName: "Deloitte", tier: "Big 4",
    hiringProcess: ["Online Assessment → Group Discussion → Technical → Partner/HR → Offer"],
    culture: "Professional services. Values integrity, inclusion, and client impact.",
    tips: ["Expect situational judgment tests in the online assessment", "Group discussion round tests your reasoning and articulation", "Technical rounds vary — consulting, advisory, or delivery roles", "Prepare 'why consulting' answers and business awareness", "Know Deloitte's service lines — audit, tax, advisory, consulting"],
  },
  zoho: {
    fullName: "Zoho", tier: "Product",
    hiringProcess: ["Online Test → Coding Round → Technical Interview → HR → Offer"],
    culture: "Product-first, R&D focused. Known for treating employees well and innovative products.",
    tips: ["Zoho's test is rigorous — covers aptitude, coding, and problem-solving", "They value clean code and algorithmic thinking", "Zoho is known for its unique work culture — research it well", "Expect questions on DBMS and web technologies", "Show genuine interest in Zoho's product ecosystem"],
  },
  freshworks: {
    fullName: "Freshworks", tier: "Product",
    hiringProcess: ["Phone Screen → Coding Test → Technical Rounds → HR → Offer"],
    culture: "Fast-paced, SaaS-focused startup culture. Chennai-based global product company.",
    tips: ["Expect SaaS and product-focused design questions", "Coding rounds focus on full-stack skills", "Freshworks values product sense and user empathy", "Learn about Freshworks' products — Freshdesk, Freshsales, etc.", "Show that you can work in a fast-paced environment"],
  },
};

const COMMON_QUESTIONS: Record<string, { question: string; answer: string }[]> = {
  google: [
    { question: "Why do you want to work at Google?", answer: "Google's mission to organize the world's information resonates with me. I admire the engineering culture, innovation, and scale of impact. I want to work on problems that affect billions of users." },
    { question: "Tell me about a time you had a conflict with a teammate.", answer: "Use the STAR method — describe a specific situation, task, action, and result. Focus on how you resolved the conflict constructively." },
    { question: "How would you design a service that returns the top-K trending keywords?", answer: "Clarify requirements (window, k), then discuss streaming aggregation, count-min sketch for frequency estimation, a sliding window with hashing, and a top-K data structure. Mention trade-offs of memory vs. accuracy." },
  ],
  microsoft: [
    { question: "Why Microsoft?", answer: "Microsoft's 'empower every person and organization' mission aligns with my values. I'm excited about the diversity of products — Azure, VS Code, Office — and the growth mindset culture." },
    { question: "Tell me about a project you're proud of and your contribution.", answer: "Pick your strongest project. Walk through the problem, the tech choices you made and why, the trade-offs, and a quantifiable result. Microsoft interviewers probe depth here." },
    { question: "How would you design a feature for VS Code used by millions?", answer: "Start with user persona and requirements, propose a minimal viable implementation, discuss performance (must stay fast), extensibility via the extension API, and roll-out/testing strategy." },
  ],
  amazon: [
    { question: "Tell me about a time you went above and beyond.", answer: "Use STAR format — focus on a specific example where you took ownership and delivered beyond expectations. Tie it to an Amazon Leadership Principle." },
    { question: "How would you design X (e.g., Amazon's recommendation system)?", answer: "Start with requirements, then high-level architecture, dive deep into components, mention trade-offs, and discuss scale." },
    { question: "Tell me about a time you had to make a decision with incomplete information.", answer: "Amazon loves this. Describe the decision, what data you gathered, how you mitigated risk, what you decided, and the outcome — then what you'd do differently." },
  ],
  meta: [
    { question: "Why Meta?", answer: "Meta's scale — billions of users — and its build-ship-learn culture excite me. I want to ship products that create real-world impact at global scale." },
    { question: "Design Instagram feed. What are the key components?", answer: "Discuss feed ranking, caching (Redis), content delivery (CDN), storage (PostgreSQL + Blob), push vs. pull fanout, and the trade-off between consistency and latency." },
    { question: "Tell me about a time you moved fast and shipped something.", answer: "Give a concrete example of shipping quickly, what you cut to ship, how you measured impact, and how you iterated based on user feedback." },
  ],
  apple: [
    { question: "Why Apple?", answer: "Apple's obsession with craft and the end-user experience matches how I work. I care about the details that most people skip, and Apple's products embody that." },
    { question: "Walk me through the hardest bug you've ever debugged.", answer: "Pick a genuinely hard bug. Explain how you narrowed it down, what tools you used, the root cause, and how you prevented similar bugs. Apple interviewers value this deep-dive." },
    { question: "How would you improve battery life in an iOS app?", answer: "Discuss profiling with Instruments, reducing network calls, batching, background work limits, memory optimization, and measuring impact before/after." },
  ],
  netflix: [
    { question: "Tell me about a time you challenged a decision you disagreed with.", answer: "Netflix values candor. Describe a disagreement where you gave direct feedback, how you argued with data, and what the outcome was — even if you lost." },
    { question: "How would you design Netflix's recommendation ranking?", answer: "Cover candidate generation, feature engineering, model training, online/offline evaluation, and the business metrics (engagement, retention) you'd optimize." },
    { question: "What would you do differently in your last project if you could?", answer: "Be honest and specific. Netflix looks for self-awareness and a bias for high performance, not defensive answers." },
  ],
  nvidia: [
    { question: "Explain how you would optimize a matrix multiplication kernel.", answer: "Discuss tiling to use shared memory, coalesced memory access, vectorized loads, occupancy tuning, and comparing against cuBLAS baselines." },
    { question: "Why NVIDIA?", answer: "NVIDIA is at the center of the AI revolution. I want to build at the intersection of systems engineering and ML, where hardware meets software." },
    { question: "How does the transformer attention mechanism scale with sequence length?", answer: "Explain O(n²) attention complexity, KV-cache memory growth, and techniques like FlashAttention, sparse attention, or chunking to address it." },
  ],
  adobe: [
    { question: "How would you improve the export workflow in Photoshop?", answer: "Understand the user's goal, reduce clicks, add batch/cloud export options, and measure impact on task completion time. Adobe loves product-sense answers." },
    { question: "Tell me about a time you simplified a complex system.", answer: "Describe the complexity, how you identified the essence, what you removed, and the measurable improvement (speed, maintenance, adoption)." },
  ],
  oracle: [
    { question: "Write a query to find the second-highest salary per department.", answer: "Use a window function: ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC). Explain why this beats a correlated subquery for large tables." },
    { question: "How do indexes work and when do they hurt?", answer: "B-tree indexes speed lookups but slow writes and consume space. Covering indexes, composite index order, and when the optimizer ignores indexes (low selectivity)." },
  ],
  salesforce: [
    { question: "Explain Salesforce's multi-tenant architecture.", answer: "Shared database, shared schema with metadata-driven design. Discuss data isolation via OrgID, the trade-offs, and why it enables rapid upgrades." },
    { question: "Tell me about a time you put the customer first.", answer: "Give a concrete example where you prioritized customer needs over convenience, and the positive outcome. Tie it to the Ohana culture." },
  ],
  atlassian: [
    { question: "Design Jira's notification system.", answer: "Discuss event-driven architecture, pub/sub, preference-based filtering, batching, and delivery channels (email, push, in-app). Atlassian wants clear product thinking." },
    { question: "Tell me about a time you collaborated across teams.", answer: "Atlassian's 'Don't #@!% the customer' and team-play values make this critical. Describe coordination, communication, and shared success." },
  ],
  uber: [
    { question: "Design the driver-passenger matching system.", answer: "Discuss geo-indexing (geohash/grid), finding nearby drivers, ETA prediction, surge pricing triggers, and dispatch optimization with latency constraints." },
    { question: "How would you detect and handle fake GPS coordinates?", answer: "Cover heuristics (speed anomalies), consistency checks across trips, ML anomaly detection, and system design for flagging without hurting genuine users." },
  ],
  flipkart: [
    { question: "Design the cart and checkout system for high volume.", answer: "Discuss inventory locking vs. soft reservation, idempotency for payments, cart persistence (Redis + DB), and handling flash-sale spikes." },
    { question: "How would you rank search results for 'iPhone 15'?", answer: "Cover recall (query understanding, synonyms), ranking features (relevance, sales, rating, seller reliability), personalization, and business rules." },
    { question: "Tell me about a time you worked under tight deadlines.", answer: "Give specifics — the deadline, how you prioritized, what you delivered, and the trade-offs you consciously made." },
  ],
  swiggy: [
    { question: "How does Swiggy predict delivery time?", answer: "Discuss ETA modeling: food prep time, rider travel time from historical trip data, live traffic, and how the model retrains on fresh data." },
    { question: "Design the rider-assignment system.", answer: "Cover real-time geo index, rider load, order context, predicted delivery times, and assignment policies balancing customer wait vs. rider efficiency." },
  ],
  zomato: [
    { question: "How would you rank restaurants for a user's home screen?", answer: "Discuss personalization (cuisine history), distance and delivery time, ratings quality, and business levers like sponsored listings — and how you'd evaluate the ranking." },
    { question: "Design the order tracking feature.", answer: "Cover order status events, pub/sub updates, real-time location streaming, and UI states (confirmed → preparing → out for delivery → delivered)." },
  ],
  paytm: [
    { question: "How do you ensure a payment is processed exactly once?", answer: "Discuss idempotency keys, unique constraints on transaction IDs, retry semantics, and reconciliation against the bank/UPI ledger." },
    { question: "Design a wallet balance ledger that scales to millions.", answer: "Discuss double-entry accounting, per-user balance caching with a durable source of truth, and optimistic locking to prevent overdrafts." },
  ],
  razorpay: [
    { question: "How would you design the payment-refund flow?", answer: "Discuss state machine (created → processing → success/failed), idempotency, partial refunds, settlement reconciliation, and retry handling." },
    { question: "How do you handle a payment gateway that times out?", answer: "Never mark failed on timeout. Use a callback/polling reconciliation, keep the order in 'pending', and implement a saga/compensation flow." },
  ],
  phonepe: [
    { question: "Explain how UPI payment works end-to-end.", answer: "User initiates via PSP app → NPCI UPI rails → issuer bank validates → debit → PSP credits → callback to merchant. Discuss P2P vs P2M and mandates." },
    { question: "How would you handle duplicate UPI transaction callbacks?", answer: "Use idempotency keys and unique transaction references, and reconcile against NPCI before finalizing the merchant credit." },
  ],
  infosys: [
    { question: "Explain the difference between a thread and a process.", answer: "A process is an isolated execution unit with its own memory; threads share memory within a process. Context switching is cheaper for threads. Give real examples (multithreaded servers)." },
    { question: "Why do you want to join Infosys?", answer: "Talk about the learning ecosystem, Infosys Foundation training, global exposure, and process discipline — backed by one example of how you like structured growth." },
  ],
  tcs: [
    { question: "What is the difference between a primary key and a unique key?", answer: "Primary key is unique + not null + single per table (logical identity); unique key allows one NULL and can be multiple. Both create indexes." },
    { question: "Where do you see yourself in five years?", answer: "Give a growth-focused answer: from a competent developer to a technical lead, acquiring domain expertise and certifications at TCS. Avoid vague answers." },
  ],
  wipro: [
    { question: "Explain polymorphism with a real example.", answer: "Compile-time (overloading) vs runtime (overriding). Example: a Shape reference invoking draw() that resolves to Circle/Square at runtime." },
    { question: "Why should we hire you?", answer: "Anchor in your top 2-3 strengths with evidence (projects, internships), your willingness to learn, and how you align with Wipro's client-facing culture." },
  ],
  accenture: [
    { question: "Tell me about yourself.", answer: "Structured 60-90 second answer: education → skills → key projects/internships → why Accenture and the role. Practice it aloud until it sounds natural, not memorized." },
    { question: "Describe a situation where you showed leadership.", answer: "Use STAR. Even a college event or group project works — emphasize how you coordinated people, made decisions, and owned the outcome." },
  ],
  capgemini: [
    { question: "What are the four pillars of OOP?", answer: "Abstraction, Encapsulation, Inheritance, Polymorphism — explain each with a one-line Java/Python example." },
    { question: "What is your preferred tech stack and why?", answer: "Be genuine and specific — mention the stack you know, a project using it, and openness to learn others. Avoid 'I know everything'." },
  ],
  cognizant: [
    { question: "What is ACID in databases?", answer: "Atomicity, Consistency, Isolation, Durability — define each and give a transaction example (bank transfer) where they matter." },
    { question: "How do you keep yourself updated with technology?", answer: "Mention specific sources you actually use — GitHub trending, Coursera/YouTube, tech blogs, hackathons — with an example of something you recently learned." },
  ],
  deloitte: [
    { question: "Why consulting, and why Deloitte?", answer: "Talk about solving problems across industries, the exposure Deloitte gives, and how your analytical + communication skills fit. Be specific about a Deloitte service line." },
    { question: "How would you advise a client whose costs are rising?", answer: "Don't jump to answers — structure it: understand their business, segment costs, benchmark, identify quick wins vs. structural changes, and propose a phased plan with KPIs." },
  ],
  zoho: [
    { question: "What is a left join in SQL?", answer: "A left join returns all rows from the left table with matching rows from the right (NULLs where no match). Give an example with customers and orders." },
    { question: "Why do you want to work at Zoho?", answer: "Zoho's R&D-first philosophy and independence (no VC funding) resonate. Mention a Zoho product you use and what you'd love to build." },
  ],
  freshworks: [
    { question: "What is a SaaS architecture and how is it multi-tenant?", answer: "Explain shared infrastructure with per-tenant isolation (database, schema, or row-level), and why multi-tenancy drives the SaaS unit economics." },
    { question: "Design a simple ticketing system like Freshdesk.", answer: "Cover ticket lifecycle, agent assignment, SLA timers, notifications, and the data model (tickets, agents, companies, conversations)." },
  ],
};

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const nameSlug = (params.name as string).toLowerCase();
  const info = COMPANY_INFO[nameSlug];
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
        if (!cancelled) setUser(data);
      } catch (e) { console.error("company detail load", e); if (!cancelled) router.push("/"); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };
  const displayName = info?.fullName || nameSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const questions = COMMON_QUESTIONS[nameSlug] || [];

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Link href="/interview-preparation/company" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Companies
          </Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
                {displayName[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{displayName}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{info?.tier || "Company"}</span>
              </div>
              <Link href={`/interview-preparation/mock-interview?company=${encodeURIComponent(displayName)}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-sm font-semibold transition-all">
                <Award className="w-4 h-4" /> Practice AI Interview
              </Link>
            </div>
          </motion.div>

          {info ? (
            <>
              {/* Culture */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="p-5 rounded-2xl border border-white/5 mb-4" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-sm">Culture</h2>
                </div>
                <p className="text-sm text-slate-300">{info.culture}</p>
              </motion.div>

              {/* Hiring Process */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                className="p-5 rounded-2xl border border-white/5 mb-4" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-sm">Hiring Process</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {info.hiringProcess.map((step, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-300">{step}</span>
                  ))}
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="p-5 rounded-2xl border border-white/5 mb-4" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h2 className="font-semibold text-sm">Preparation Tips</h2>
                </div>
                <ul className="space-y-2">
                  {info.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="p-5 rounded-2xl border border-white/5 mb-4" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <h2 className="font-semibold text-sm">General Preparation</h2>
                </div>
                <p className="text-sm text-slate-300">Research {displayName}'s products, culture, and recent news. Practice coding on LeetCode and prepare behavioral stories using the STAR method.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                className="p-5 rounded-2xl border border-white/5 mb-4" style={{ background: "rgba(17,17,24,0.5)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h2 className="font-semibold text-sm">Universal Tips</h2>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />Master DSA fundamentals — arrays, strings, trees, graphs, DP</li>
                  <li className="flex items-start gap-2 text-sm text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />Prepare 3-4 STAR stories for behavioral questions</li>
                  <li className="flex items-start gap-2 text-sm text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />Review core CS: OS, DBMS, Networks, OOP, System Design</li>
                  <li className="flex items-start gap-2 text-sm text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />Practice company-specific questions on LeetCode with topic tags</li>
                  <li className="flex items-start gap-2 text-sm text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />Prepare thoughtful questions to ask the interviewer</li>
                </ul>
              </motion.div>
            </>
          )}

          {/* Common Questions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="p-5 rounded-2xl border border-white/5 mb-6" style={{ background: "rgba(17,17,24,0.5)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-400" />
              <h2 className="font-semibold text-sm">Common Interview Questions</h2>
            </div>
            {questions.length > 0 ? (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-sm font-medium mb-2">Q: {q.question}</p>
                    <p className="text-xs text-slate-400">{q.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">AI-powered company-specific questions coming soon. Use the <Link href="/interview-preparation/aptitude" className="text-indigo-400 hover:underline">Aptitude</Link> and <Link href="/interview-preparation/technical" className="text-indigo-400 hover:underline">Technical</Link> sections to prepare in the meantime.</p>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
