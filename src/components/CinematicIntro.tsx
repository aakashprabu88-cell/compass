"use client";

import { Component, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import MouseParallax from "@/components/MouseParallax";

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

function makeCompassTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(512, 512, 200, 512, 512, 512);
  g.addColorStop(0, "#f9f4e6");
  g.addColorStop(1, "#e9dec2");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.beginPath();
  ctx.arc(512, 512, 500, 0, Math.PI * 2);
  ctx.fillStyle = "#b08a3e";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(512, 512, 476, 0, Math.PI * 2);
  ctx.fillStyle = "#f2ead4";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(512, 512, 368, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(20,20,20,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let a = 0; a < 360; a += 2) {
    const rad = (a * Math.PI) / 180;
    const long = a % 30 === 0;
    const med = a % 10 === 0;
    const r1 = 470;
    const r2 = long ? 408 : med ? 448 : 466;
    ctx.beginPath();
    ctx.moveTo(512 + Math.sin(rad) * r1, 512 - Math.cos(rad) * r1);
    ctx.lineTo(512 + Math.sin(rad) * r2, 512 - Math.cos(rad) * r2);
    ctx.strokeStyle = long ? "#1a1a1a" : med ? "#3a3a3a" : "#6a6a6a";
    ctx.lineWidth = long ? 10 : med ? 6 : 3;
    ctx.stroke();
  }
  ctx.font = "900 64px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const dirs: [string, number, number, string][] = [
    ["N", 512, 512 - 342, "#c0392b"],
    ["E", 512 + 342, 512, "#1a1a1a"],
    ["S", 512, 512 + 342, "#1a1a1a"],
    ["W", 512 - 342, 512, "#1a1a1a"],
  ];
  dirs.forEach(([t, x, y, col]) => {
    ctx.fillStyle = col;
    ctx.fillText(t, x, y);
  });
  ctx.font = "700 40px Georgia, serif";
  ctx.fillStyle = "rgba(26,26,26,0.75)";
  [["NE", 512 + 246, 512 - 246], ["SE", 512 + 246, 512 + 246], ["SW", 512 - 246, 512 + 246], ["NW", 512 - 246, 512 - 246]].forEach(([t, x, y]) => {
    ctx.fillText(t as string, x as number, y as number);
  });
  ctx.beginPath();
  ctx.arc(512, 512, 40, 0, Math.PI * 2);
  ctx.fillStyle = "#b08a3e";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(512, 512, 16, 0, Math.PI * 2);
  ctx.fillStyle = "#1a1a1a";
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeDust(n: number) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 1.7 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 1.2;
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

function IntroInner({ onAligned }: { onAligned: (n: number) => void }) {
  const mouse = useRef({ x: 0, y: 0 });
  const start = useRef(performance.now());
  const sceneG = useRef<THREE.Group>(null!);
  const lid = useRef<THREE.Group>(null!);
  const needle = useRef<THREE.Group>(null!);
  const orbit = useRef<THREE.Mesh>(null!);
  const dust = useRef<THREE.Points>(null!);
  const nMark = useRef<THREE.Mesh>(null!);
  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#f59e0b", transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const nMarkMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#f59e0b", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const orbitMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#f59e0b", transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const dustMat = useMemo(() => new THREE.PointsMaterial({ color: "#f59e0b", size: 0.03, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), []);
  const dustGeo = useMemo(() => makeDust(110), []);
  const cardGeo = useMemo(() => new THREE.CircleGeometry(1.15, 96), []);
  const cardTex = useMemo(() => makeCompassTexture(), []);
  const aligned = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const el = (performance.now() - start.current) / 1000;
    const cam = state.camera;
    const dolly = easeOutCubic(clamp01((el - 0.3) / 1.8));
    const tz = 7.2 - 1.9 * dolly;
    cam.position.x += (-mouse.current.x * 0.5 - cam.position.x) * 0.08;
    cam.position.y += (0.35 - mouse.current.y * 0.3 - cam.position.y) * 0.08;
    cam.position.z += (tz - cam.position.z) * 0.08;
    cam.lookAt(0, -1.2, 0);

    if (sceneG.current) {
      sceneG.current.rotation.y = Math.sin(el * 0.16) * 0.12;
      sceneG.current.position.x += (mouse.current.x * 0.55 - sceneG.current.position.x) * 0.09;
      sceneG.current.position.y += (-1.2 + mouse.current.y * 0.4 - sceneG.current.position.y) * 0.09;
    }

    if (lid.current) lid.current.rotation.x = -2.05 * easeOutCubic(clamp01((el - 0.7) / 1.15));

    if (needle.current) {
      let ang: number;
      if (el < 0.8) ang = 0;
      else if (el < 1.7) {
        const spin = clamp01((el - 0.8) / 0.9);
        ang = spin * 13;
      } else if (el < 3.4) {
        const k = (el - 1.7) / 1.7;
        ang = 13 * (1 - k) - 1.1 * Math.sin(k * Math.PI * 2);
      } else ang = 0;
      needle.current.rotation.z = ang;
      if (el > 3.2 && !aligned.current) {
        aligned.current = true;
        onAligned(performance.now());
      }
    }

    if (nMark.current) {
      const tN = clamp01((el - 3.3) / 0.5);
      nMark.current.scale.setScalar(tN);
      nMarkMat.opacity = tN * (0.55 + 0.35 * Math.sin(el * 5));
    }

    coreMat.opacity = 0.75 + 0.25 * Math.sin(el * 1.8);
    if (orbit.current) {
      orbit.current.rotation.z = el * 0.3;
      orbit.current.rotation.x = 1.1 + Math.sin(el * 0.2) * 0.08;
    }
    if (dust.current) dust.current.rotation.y = el * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#fff1d6" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#818cf8" />
      <pointLight position={[0, -1.2, 3]} intensity={22} color="#f59e0b" />

      <points ref={dust} geometry={dustGeo}>
        <primitive object={dustMat} attach="material" />
      </points>

      <mesh ref={orbit}>
        <torusGeometry args={[2.3, 0.02, 12, 96]} />
        <primitive object={orbitMat} attach="material" />
      </mesh>

      <group ref={sceneG} position={[0, -1.2, 0]}>
        <group ref={lid} position={[0, 1.18, 0]}>
          <mesh position={[0, -1.18, 0.03]}>
            <circleGeometry args={[1.22, 96]} />
            <meshStandardMaterial color="#b08a3e" metalness={1} roughness={0.35} />
          </mesh>
          <mesh position={[0, -1.18, -0.05]}>
            <cylinderGeometry args={[1.18, 1.18, 0.1, 96, 1, true]} />
            <meshStandardMaterial color="#9a7434" metalness={1} roughness={0.4} side={THREE.BackSide} />
          </mesh>
          <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
            <meshStandardMaterial color="#8a6a2f" metalness={1} roughness={0.4} />
          </mesh>
        </group>

        <mesh position={[0, 0, -0.14]}>
          <cylinderGeometry args={[1.18, 1.18, 0.36, 96, 1, true]} />
          <meshStandardMaterial color="#b08a3e" metalness={1} roughness={0.35} side={THREE.BackSide} />
        </mesh>

        <mesh>
          <torusGeometry args={[1.18, 0.085, 20, 96]} />
          <meshStandardMaterial color="#b08a3e" metalness={1} roughness={0.3} />
        </mesh>

        <mesh geometry={cardGeo} position={[0, 0, -0.06]}>
          <meshBasicMaterial map={cardTex} />
        </mesh>

        <mesh ref={nMark} position={[0, 0.86, 0.05]}>
          <coneGeometry args={[0.15, 0.34, 4]} />
          <primitive object={nMarkMat} attach="material" />
        </mesh>

        <group ref={needle}>
          <mesh position={[0, 0.5, 0.02]}><boxGeometry args={[0.09, 1.0, 0.02]} /><meshStandardMaterial color="#c0392b" metalness={0.5} roughness={0.35} /></mesh>
          <mesh position={[0, -0.5, 0.02]}><boxGeometry args={[0.09, 1.0, 0.02]} /><meshStandardMaterial color="#e8e8e8" metalness={0.7} roughness={0.3} /></mesh>
          <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 0.1, 20]} /><meshStandardMaterial color="#b08a3e" metalness={1} roughness={0.3} /></mesh>
        </group>

        <mesh position={[0, 0, 0.08]}><sphereGeometry args={[0.09, 20, 16]} /><primitive object={coreMat} attach="material" /></mesh>

        <mesh position={[0, 0, 0.05]}>
          <circleGeometry args={[1.16, 96]} />
          <meshPhysicalMaterial color="#dbe6ff" transparent opacity={0.12} roughness={0.05} metalness={0} clearcoat={1} clearcoatRoughness={0.1} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

class IntroBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function CinematicIntro({ onAligned, onEnter }: { onAligned?: (t: number) => void; onEnter: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onEnter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEnter]);

  return (
    <IntroBoundary>
      <div className="absolute inset-0 z-[70] bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_70%,rgba(245,158,11,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgba(99,102,241,0.14),transparent_70%)]" />
        <div className="absolute top-0 inset-x-0 h-[7vh] bg-black z-20 border-b border-white/5" />
        <div className="absolute bottom-0 inset-x-0 h-[7vh] bg-black z-20 border-t border-white/5" />

        <Canvas camera={{ position: [0, 0.35, 7.2], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ pointerEvents: "none" }}>
          <IntroInner onAligned={onAligned ?? (() => {})} />
        </Canvas>

        <MouseParallax className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="flex items-center gap-4">
            <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-amber-300/60" />
            <span className="text-[10px] sm:text-xs tracking-[0.6em] uppercase text-slate-300 font-display">Compass presents</span>
            <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-amber-300/60" />
          </motion.div>

          <h1 className="mt-2 flex text-[clamp(3.4rem,16vw,11rem)] font-display font-black leading-none tracking-[0.02em] drop-shadow-[0_10px_60px_rgba(217,192,136,0.35)]" style={{ perspective: 900 }} aria-label="COMPASS">
            {"COMPASS".split("").map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.06em] -mb-[0.06em]">
                <motion.span
                  initial={{ y: "120%", rotateX: 26, opacity: 0 }}
                  animate={{ y: 0, rotateX: 0, opacity: 1 }}
                  transition={{ delay: 1.4 + i * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block origin-bottom"
                  style={{ backgroundImage: "linear-gradient(180deg,#ffffff 25%,#d9c088 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {ch}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 0.6 }}
            className="mt-3 text-[10px] sm:text-sm tracking-[0.45em] uppercase text-slate-400">
            The career OS · told in <span className="text-white font-semibold">10 moves</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 3.0, duration: 0.5 }}
            className="mt-6 w-64 sm:w-80 h-px bg-white/15 origin-left" />

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.2, duration: 0.6 }} className="mt-7">
            <motion.button
              onClick={onEnter}
              animate={{ boxShadow: ["0 0 0 0 rgba(245,158,11,0.45)", "0 0 0 14px rgba(245,158,11,0)"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              className="pointer-events-auto relative inline-flex items-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-sm sm:text-base font-bold text-white overflow-hidden">
              <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
              <Play className="w-4 h-4 fill-current" /> Begin the film
            </motion.button>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.7, duration: 0.5 }}
            className="mt-4 text-[10px] tracking-[0.35em] uppercase text-slate-600">
            press <span className="text-slate-400">Enter</span> to begin
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.5, duration: 0.5 }}
            className="absolute inset-x-0 bottom-[10vh] flex items-center justify-center gap-2.5 text-[10px] tracking-[0.4em] uppercase text-amber-300/90">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Aligned to true north
          </motion.div>
        </MouseParallax>

        <style>{`@keyframes introGrain { 0%{transform:translate(0,0)} 25%{transform:translate(-2px,3px)} 50%{transform:translate(3px,-2px)} 75%{transform:translate(-1px,-3px)} 100%{transform:translate(2px,2px)} }`}</style>
      </div>
    </IntroBoundary>
  );
}
