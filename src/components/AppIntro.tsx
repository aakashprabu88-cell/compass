"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const TICKS = Array.from({ length: 24 }, (_, i) => i * 15);

const FEATURES = [
  {
    kicker: "01 · Understand",
    title: "AI Career Assessment",
    desc: "Answer questions — get career recommendations matched to your interests, personality and skills.",
    icon: (
      <path d="M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z" />
    ),
  },
  {
    kicker: "02 · Discover",
    title: "50+ Career Paths",
    desc: "Your interests, personality and skills — mapped to the careers that fit you best.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 3.5V7M12 17v3.5M3.5 12H7M17 12h3.5" />
        <path d="M7.6 7.6l2.2 2.2M14.2 14.2l2.2 2.2M16.4 7.6l-2.2 2.2M9.8 14.2l-2.2 2.2" />
      </>
    ),
  },
  {
    kicker: "03 · Find",
    title: "AI Job & Internship Discovery",
    desc: "Live jobs and internships that match your profile — served straight to your dashboard.",
    icon: (
      <>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.3 7L12 12l8.7-5" />
        <path d="M12 22V12" />
      </>
    ),
  },
  {
    kicker: "04 · Grow",
    title: "Skill Gap Analysis",
    desc: "Compass spots the missing skills and points you to the right learning resources.",
    icon: (
      <>
        <path d="M12 21s-7-4.5-7-11a7 7 0 0 1 14 0c0 6.5-7 11-7 11z" />
        <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
      </>
    ),
  },
  {
    kicker: "05 · Practice",
    title: "AI Mock Interview",
    desc: "Practice with the AI, get question-by-question feedback and a performance score.",
    icon: (
      <>
        <path d="M5 6a7 7 0 0 1 14 0c0 6-3 9-7 10-4-1-7-4-7-10z" />
        <circle cx="12" cy="6" r="2.6" />
        <path d="M9 16v5M15 16v5M9.5 21h5" />
      </>
    ),
  },
  {
    kicker: "06 · Future-proof",
    title: "Future Readiness Score",
    desc: "See how prepared you are for the changing job market — and how to close the gap.",
    icon: (
      <>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
      </>
    ),
  },
];

export default function AppIntro() {
  const router = useRouter();

  const stageRef = useRef<HTMLDivElement>(null);
  const tfillRef = useRef<HTMLDivElement>(null);
  const needleNRef = useRef<HTMLDivElement>(null);
  const needleSRef = useRef<HTMLDivElement>(null);

  const exitIntro = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const d = await res.json();
        if (d?.id) { router.push("/dashboard"); return; }
      }
    } catch {}
    router.push("/login");
  };

  const replay = () => {
    stageRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const spin = setInterval(() => {
      const s = needleNRef.current;
      if (s) {
        const deg = s.dataset.d ? (parseFloat(s.dataset.d) + 1) % 720 : 0;
        s.dataset.d = String(deg);
        s.style.transform = `rotate(${deg}deg)`;
        if (needleSRef.current) {
          needleSRef.current.style.transform = `rotate(${(deg + 180) % 360}deg)`;
        }
      }
    }, 30);

    const sections = Array.from(stage.querySelectorAll<HTMLElement>(".scene"));
    const active = new Map<HTMLElement, boolean>();

    const apply = () => {
      sections.forEach((s) => s.classList.toggle("active", !!active.get(s)));
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          active.set(e.target as HTMLElement, e.isIntersecting);
        });
        apply();
      },
      { root: stage, threshold: 0.5 }
    );
    sections.forEach((s) => io.observe(s));

    const onScroll = () => {
      const max = stage.scrollHeight - stage.clientHeight;
      if (tfillRef.current) {
        tfillRef.current.style.width = `${max > 0 ? Math.min(100, (stage.scrollTop / max) * 100) : 100}%`;
      }
    };
    stage.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      clearInterval(spin);
      io.disconnect();
      stage.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="intro-root">
      <div ref={stageRef} className="i-stage">
        <div className="i-grid" aria-hidden />
        <div className="i-aurora" aria-hidden />

        {/* Scene 1 — Problem */}
        <section className="scene">
          <div className="status-bar">
            <span className="dot" /> The Problem
          </div>
          <div className="float-item" style={{ left: "6%", top: "22%" }}>
            🎓 <strong>Engineering</strong>
          </div>
          <div className="float-item" style={{ right: "7%", top: "26%" }}>
            💼 <strong>Job listings</strong>
          </div>
          <div className="float-item" style={{ left: "10%", bottom: "30%" }}>
            📚 <strong>Courses</strong>
          </div>
          <div className="float-item" style={{ right: "9%", bottom: "34%" }}>
            🎯 <strong>Careers?</strong>
          </div>
          <div className="qm" style={{ left: "22%", top: "44%" }}>?</div>
          <div className="qm" style={{ right: "24%", top: "40%" }}>?</div>
          <div className="qm" style={{ left: "30%", bottom: "20%" }}>?</div>
          <div className="student confused">
            <div className="head" />
            <div className="body" />
          </div>
          <div className="glow-ring" />
          <div className="center line-in">
            <h1>
              Thousands of career paths.
              <br />
              <span className="muted">One confused student.</span>
            </h1>
          </div>
        </section>

        {/* Scene 2 — Compass */}
        <section className="scene">
          <div className="center" style={{ width: "100%" }}>
            <div className="compass-wrap line-in">
              <div className="compass">
                {TICKS.map((deg) => (
                  <div key={deg} className="tick" style={{ transform: `rotate(${deg}deg)` }} />
                ))}
              </div>
              <div ref={needleNRef} className="needle nh" />
              <div ref={needleSRef} className="needle sh" />
              <div className="hub" />
              <span className="dir n">N</span>
              <span className="dir s">S</span>
              <span className="dir e">E</span>
              <span className="dir w">W</span>
            </div>
            <h2 className="line-in" style={{ marginTop: 10 }}>
              <span className="text-gradient">Meet COMPASS</span>
            </h2>
            <div className="sub line-in">Your AI-powered career navigator.</div>
          </div>
        </section>

        {/* Scene 3 — Features */}
        {FEATURES.map((f) => (
          <section key={f.title} className="scene feature">
            <div className="status-bar">
              <span className="dot" /> What Compass Does
            </div>
            <div className="f-icon pop">
              <svg viewBox="0 0 24 24">{f.icon}</svg>
            </div>
            <div className="f-kicker pop">{f.kicker}</div>
            <div className="f-title pop">{f.title}</div>
            <div className="f-desc pop">{f.desc}</div>
          </section>
        ))}

        {/* Scene 4 — Transformation */}
        <section className="scene">
          <div className="path" />
          <div className="node" style={{ left: "20%" }}>
            <span>Assess</span>
          </div>
          <div className="node" style={{ left: "36%" }}>
            <span>Careers</span>
          </div>
          <div className="node" style={{ left: "52%" }}>
            <span>Jobs</span>
          </div>
          <div className="node" style={{ left: "68%" }}>
            <span>Skills</span>
          </div>
          <div className="node" style={{ left: "84%" }}>
            <span>Interview</span>
          </div>
          <div className="student confident">
            <div className="head" />
            <div className="body" />
          </div>
          <div className="glow-ring" />
          <div className="center line-in" style={{ top: "34%" }}>
            <h1 className="text-gradient">From confusion → to clarity.</h1>
            <h1
              className="muted"
              style={{ marginTop: 18, fontSize: "clamp(22px,2.6vw,36px)" }}
            >
              From skills → to opportunities.
            </h1>
          </div>
        </section>

        {/* Scene 5 — End */}
        <section className="scene">
          <div className="center line-in" style={{ width: "100%", padding: "0 6vw" }}>
            <div className="logo-badge">
              <div className="compass" style={{ position: "absolute", inset: 0 }}>
                {TICKS.map((deg) => (
                  <div key={deg} className="tick" style={{ transform: `rotate(${deg}deg)`, transformOrigin: "50% 48px" }} />
                ))}
              </div>
              <div className="needle nh i-spin" style={{ margin: "-45px 0 0 -3px", height: 44, transformOrigin: "50% 22px", position: "absolute", left: "50%", top: "50%" }} />
              <div className="needle sh i-spin" style={{ margin: "-45px 0 0 -3px", height: 44, transformOrigin: "50% 22px", position: "absolute", left: "50%", top: "50%", animationDirection: "reverse" }} />
              <div className="hub" style={{ position: "absolute" }} />
            </div>
            <h2 style={{ fontSize: "clamp(40px,6vw,80px)", letterSpacing: 8 }}>
              <span className="text-gradient">COMPASS</span>
            </h2>
            <div className="sub" style={{ fontSize: "clamp(15px,1.6vw,20px)", color: "var(--i-muted)" }}>
              Navigate your future. <span style={{ color: "var(--i-cyan)" }}>Don&apos;t just search for it.</span>
            </div>
            <button onClick={exitIntro} className="cta">
              Explore Compass →
            </button>
          </div>
        </section>

        <div className="tbar">
          <div ref={tfillRef} className="tfill" />
        </div>
        <div className="i-controls">
          <button onClick={replay}>↻ Replay</button>
          <button onClick={exitIntro}>Skip intro →</button>
        </div>
      </div>
    </div>
  );
}
