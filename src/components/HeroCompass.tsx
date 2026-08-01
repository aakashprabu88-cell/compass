"use client";

import { Component, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const SLIDE_COLORS = ["#f59e0b", "#818cf8", "#22d3ee", "#34d399", "#a855f7", "#f472b6", "#fbbf24"];
const CAMS = [
  [-0.5, 0.45, 7.6],
  [-0.85, 0.55, 6.6],
  [-1.05, 0.5, 6.2],
  [-0.5, 1.3, 6.9],
  [-1.3, 0.65, 5.8],
  [-1.05, 0.4, 6.4],
  [-0.5, 0.2, 4.9],
] as const;

const smooth = (x: number) => {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
};

const fadeS = (d: number, s: number) => {
  const a = Math.max(0, Math.min(1, d - (s - 0.5)));
  const b = Math.max(0, Math.min(1, d - (s + 0.5)));
  return smooth(a) * (1 - smooth(b));
};

function makeCardTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(512, 512, 200, 512, 512, 512);
  g.addColorStop(0, "#faf6e8");
  g.addColorStop(1, "#e9dec2");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.beginPath();
  ctx.arc(512, 512, 500, 0, Math.PI * 2);
  ctx.fillStyle = "#b08a3e";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(512, 512, 478, 0, Math.PI * 2);
  ctx.fillStyle = "#f2ead4";
  ctx.fill();
  for (let a = 0; a < 360; a += 2) {
    const rad = (a * Math.PI) / 180;
    const long = a % 30 === 0;
    const med = a % 10 === 0;
    ctx.beginPath();
    ctx.moveTo(512 + Math.sin(rad) * 470, 512 - Math.cos(rad) * 470);
    ctx.lineTo(512 + Math.sin(rad) * (long ? 400 : med ? 448 : 464), 512 - Math.cos(rad) * (long ? 400 : med ? 448 : 464));
    ctx.strokeStyle = long ? "#1a1a1a" : med ? "#3a3a3a" : "#6a6a6a";
    ctx.lineWidth = long ? 9 : med ? 5 : 2;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(512, 512, 360, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(20,20,20,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(512, 512, 150, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(20,20,20,0.28)";
  ctx.lineWidth = 3;
  ctx.stroke();
  const rose = (a: number) => {
    const rad = (a * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(512, 512);
    ctx.lineTo(512 + Math.sin(rad) * 150, 512 - Math.cos(rad) * 150);
    ctx.strokeStyle = "rgba(26,26,26,0.55)";
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(512, 512);
    ctx.lineTo(512 + Math.sin(rad) * 62, 512 - Math.cos(rad) * 62);
    ctx.strokeStyle = "rgba(26,26,26,0.25)";
    ctx.lineWidth = 12;
    ctx.stroke();
  };
  [0, 45, 90, 135, 180, 225, 270, 315].forEach(rose);
  ctx.beginPath();
  ctx.arc(512, 512, 34, 0, Math.PI * 2);
  ctx.fillStyle = "#b08a3e";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(512, 512, 12, 0, Math.PI * 2);
  ctx.fillStyle = "#1a1a1a";
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeLetterTexture(ch: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 128, 128);
  ctx.font = "900 92px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#2b1d0a";
  ctx.fillText(ch, 67, 67);
  ctx.fillStyle = "#fdf6e0";
  ctx.fillText(ch, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeGlowTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(0.5, outer);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function makeShadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,0.6)");
  g.addColorStop(0.55, "rgba(0,0,0,0.28)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function makeRingPoints(n: number, radius: number) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * radius;
    pos[i * 3 + 1] = 0;
    pos[i * 3 + 2] = Math.sin(a) * radius;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

function makeBurst(n: number) {
  const pos = new Float32Array(n * 3);
  const vel = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    vel[i * 3] = dir.x * (0.4 + Math.random() * 0.9);
    vel[i * 3 + 1] = dir.y * (0.4 + Math.random() * 0.9);
    vel[i * 3 + 2] = dir.z * (0.4 + Math.random() * 0.9);
    pos[i * 3] = 0; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = 0;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return { g, vel };
}

function makeDust(n: number, rmin: number, rmax: number) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = rmin + Math.random() * (rmax - rmin);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

function makeGrid() {
  const size = 9;
  const step = 0.5;
  const lines: number[] = [];
  for (let i = -size; i <= size; i += step) {
    lines.push(-size, 0, i, size, 0, i);
    lines.push(i, 0, -size, i, 0, size);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lines), 3));
  return g;
}

function makeNebulaTexture() {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 1024, 512);
  g.addColorStop(0, "#06031a");
  g.addColorStop(0.35, "#0f0830");
  g.addColorStop(0.62, "#081028");
  g.addColorStop(1, "#040217");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);
  const blobs: [string, number, number, number][] = [
    ["rgba(245,158,11,0.10)", 240, 160, 150],
    ["rgba(129,140,248,0.16)", 780, 200, 190],
    ["rgba(34,211,238,0.10)", 520, 300, 140],
    ["rgba(168,85,247,0.13)", 150, 380, 170],
    ["rgba(244,114,182,0.09)", 880, 370, 140],
  ];
  for (const [col, x, y, r] of blobs) {
    const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, col);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, 1024, 512);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeRayTexture() {
  const c = document.createElement("canvas");
  c.width = 128; c.height = 1024;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 1024);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.28, "rgba(255,255,255,0.26)");
  g.addColorStop(0.5, "rgba(255,255,255,0.05)");
  g.addColorStop(0.72, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 1024);
  return new THREE.CanvasTexture(c);
}

function makeCircleLine(n: number, radius: number) {
  const arr = new Float32Array((n + 1) * 3);
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    arr[i * 3] = Math.cos(a) * radius;
    arr[i * 3 + 1] = Math.sin(a) * radius;
    arr[i * 3 + 2] = 0;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  return g;
}

function makeBokeh() {
  return Array.from({ length: 18 }, () => ({
    x: (Math.random() - 0.5) * 13,
    y: (Math.random() - 0.5) * 7,
    z: 1.6 + Math.random() * 4.6,
    s: 0.12 + Math.random() * 0.4,
    v: 0.5 + Math.random() * 1.2,
    ph: Math.random() * Math.PI * 2,
  }));
}

const LETTERS = [
  { ch: "N", x: 0, y: 0.62 },
  { ch: "E", x: 0.62, y: 0 },
  { ch: "S", x: 0, y: -0.62 },
  { ch: "W", x: -0.62, y: 0 },
];

type SlideInput = number | { current: number };

function HeroInner({ slide }: { slide: SlideInput }) {
  const { gl, scene } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const disp = useRef(typeof slide === "number" ? slide : slide.current);
  const spin = useRef<THREE.Group>(null!);
  const tilt = useRef<THREE.Group>(null!);
  const card = useRef<THREE.Group>(null!);
  const needle = useRef<THREE.Group>(null!);
  const light = useRef<THREE.PointLight>(null!);
  const aura = useRef<THREE.Sprite>(null!);
  const pulseA = useRef<THREE.Mesh>(null!);
  const pulseB = useRef<THREE.Mesh>(null!);
  const groups = [useRef<THREE.Group>(null!), useRef<THREE.Group>(null!), useRef<THREE.Group>(null!), useRef<THREE.Group>(null!), useRef<THREE.Group>(null!), useRef<THREE.Group>(null!)];
  const traitOrbit = useRef<THREE.Group>(null!);
  const careerNodes = useRef<THREE.Mesh[]>([]);
  const holoSpin = useRef<THREE.Group>(null!);
  const jobSpin = useRef<THREE.Group>(null!);
  const burst = useMemo(() => makeBurst(140), []);
  const nebula = useRef<THREE.Mesh>(null!);
  const rings = useRef<THREE.Group>(null!);
  const rays = useRef<THREE.Group>(null!);
  const hudRing = useRef<THREE.Line>(null!);
  const glowDisc = useRef<THREE.Mesh>(null!);
  const streak = useRef<THREE.Sprite>(null!);
  const bokehGroup = useRef<THREE.Group>(null!);
  const sweepRing = useRef<THREE.Mesh>(null!);
  const lastInt = useRef(-1);
  const punch = useRef(0);

  const bokeh = useMemo(() => makeBokeh(), []);
  const cardTex = useMemo(() => makeCardTexture(), []);
  const cardGeo = useMemo(() => new THREE.CircleGeometry(1.0, 96), []);
  const nTex = useMemo(() => makeLetterTexture("N"), []);
  const eTex = useMemo(() => makeLetterTexture("E"), []);
  const sTex = useMemo(() => makeLetterTexture("S"), []);
  const wTex = useMemo(() => makeLetterTexture("W"), []);
  const auraTex = useMemo(() => makeGlowTexture("rgba(255,255,255,0.9)", "rgba(255,255,255,0.22)"), []);
  const shadowTex = useMemo(() => makeShadowTexture(), []);
  const dustGeo = useMemo(() => makeDust(130, 2.4, 6.4), []);
  const starsGeo = useMemo(() => makeDust(90, 4.5, 8.5), []);
  const gridGeo = useMemo(() => makeGrid(), []);
  const nebulaTex = useMemo(() => makeNebulaTexture(), []);
  const rayTex = useMemo(() => makeRayTexture(), []);
  const nebulaGeo = useMemo(() => new THREE.SphereGeometry(42, 32, 16), []);
  const rayGeo = useMemo(() => new THREE.PlaneGeometry(1.6, 11), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(2.35, 0.014, 8, 128), []);
  const ringGeo2 = useMemo(() => new THREE.TorusGeometry(2.7, 0.01, 8, 128), []);
  const hudRingGeo = useMemo(() => makeCircleLine(96, 2.9), []);
  const discGeo = useMemo(() => new THREE.CircleGeometry(3.4, 48), []);
  const letterGeo = useMemo(() => new THREE.PlaneGeometry(0.22, 0.22), []);
  const cardCylGeo = useMemo(() => new THREE.CylinderGeometry(1.0, 1.0, 0.07, 96, 1, true), []);
  const bowlGeo = useMemo(() => new THREE.CylinderGeometry(1.14, 0.72, 0.52, 64, 1, true), []);
  const bowlCapGeo = useMemo(() => new THREE.CircleGeometry(0.72, 48), []);
  const pedGeo = useMemo(() => new THREE.CylinderGeometry(0.52, 0.74, 0.42, 48), []);
  const baseGeo = useMemo(() => new THREE.CylinderGeometry(0.96, 1.0, 0.09, 48), []);

  const brassMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#b08a3e", metalness: 1, roughness: 0.26 }), []);
  const brassDarkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#7d5f28", metalness: 1, roughness: 0.45 }), []);
  const steelMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#e8e8e8", metalness: 0.95, roughness: 0.22 }), []);
  const redMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c0392b", metalness: 0.6, roughness: 0.32 }), []);
  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffffff", metalness: 0, roughness: 0.05, transmission: 0.9, thickness: 0.25, ior: 1.5,
    clearcoat: 1, clearcoatRoughness: 0.08, transparent: true, opacity: 0.9, depthWrite: false,
  }), []);
  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#f59e0b", transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const auraMat = useMemo(() => new THREE.SpriteMaterial({ map: auraTex, color: "#f59e0b", transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }), [auraTex]);
  const dustMat = useMemo(() => new THREE.PointsMaterial({ color: "#f5d78e", size: 0.025, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), []);
  const starsMat = useMemo(() => new THREE.PointsMaterial({ color: "#cfe0ff", size: 0.035, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), []);
  const burstMat = useMemo(() => new THREE.PointsMaterial({ color: "#ffd98a", size: 0.09, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), []);
  const gridMat = useMemo(() => new THREE.LineBasicMaterial({ color: "#22d3ee", transparent: true, opacity: 0.35, depthWrite: false }), []);
  const trailMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#818cf8", transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const trailLineMat = useMemo(() => new THREE.LineBasicMaterial({ color: "#818cf8", transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const holoMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#22d3ee", transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const jobMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#34d399", transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), []);
  const jobLineMat = useMemo(() => new THREE.LineBasicMaterial({ color: "#34d399", transparent: true, opacity: 0.5, depthWrite: false }), []);
  const pulseMatA = useMemo(() => new THREE.MeshBasicMaterial({ color: "#f59e0b", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const pulseMatB = useMemo(() => new THREE.MeshBasicMaterial({ color: "#818cf8", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const ringMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#8b8bff", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const hudRingMat = useMemo(() => new THREE.LineBasicMaterial({ color: "#cfe0ff", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const hudLine = useMemo(() => new THREE.Line(hudRingGeo, hudRingMat), [hudRingGeo, hudRingMat]);
  const rayMat = useMemo(() => new THREE.MeshBasicMaterial({ map: rayTex, color: "#ffffff", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), [rayTex]);
  const nebulaMat = useMemo(() => new THREE.MeshBasicMaterial({ map: nebulaTex, color: "#ffffff", side: THREE.BackSide, depthWrite: false, transparent: true }), [nebulaTex]);
  const streakMat = useMemo(() => new THREE.SpriteMaterial({ map: auraTex, color: "#f59e0b", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), [auraTex]);
  const bokehMat = useMemo(() => new THREE.SpriteMaterial({ map: auraTex, color: "#ffffff", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), [auraTex]);
  const glowDiscMat = useMemo(() => new THREE.MeshBasicMaterial({ map: auraTex, color: "#f59e0b", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), [auraTex]);
  const sweepMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#a5c8ff", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), []);
  const letterMats = useMemo(() => [nTex, eTex, sTex, wTex].map(tex => new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 1, side: THREE.DoubleSide })), [nTex, eTex, sTex, wTex]);
  const tickMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c9a861", metalness: 0.9, roughness: 0.32 }), []);

  const careerMats = useMemo(() => ["#22d3ee", "#a855f7", "#f59e0b", "#f472b6", "#34d399"].map(col => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.6, metalness: 0.4, roughness: 0.3, transparent: true, opacity: 1 })), []);
  const riskMats = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: "#ef4444", emissive: "#ef4444", emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.4, transparent: true, opacity: 1 }),
    new THREE.MeshStandardMaterial({ color: "#f97316", emissive: "#f97316", emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.4, transparent: true, opacity: 1 }),
    new THREE.MeshStandardMaterial({ color: "#34d399", emissive: "#34d399", emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.4, transparent: true, opacity: 1 }),
    new THREE.MeshStandardMaterial({ color: "#34d399", emissive: "#34d399", emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.4, transparent: true, opacity: 1 }),
    new THREE.MeshStandardMaterial({ color: "#f59e0b", emissive: "#f59e0b", emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.4, transparent: true, opacity: 1 }),
  ], []);

  const traitPos = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * 2.0, Math.sin(a) * 1.15, 0.1);
  }), []);
  const traitLineGeo = useMemo(() => {
    const arr = new Float32Array(traitPos.length * 6);
    traitPos.forEach((p, i) => {
      arr[i * 6] = 0; arr[i * 6 + 1] = 0; arr[i * 6 + 2] = 0;
      arr[i * 6 + 3] = p.x; arr[i * 6 + 4] = p.y; arr[i * 6 + 5] = p.z;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [traitPos]);

  const careerPos = useMemo(() => Array.from({ length: 5 }, (_, i) => {
    const a = -0.85 + (i / 4) * 1.7;
    return new THREE.Vector3(Math.sin(a) * 2.4, (i - 2) * 0.62, -0.4);
  }), []);

  const holoPos = useMemo(() => Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * 1.9, 1.15, Math.sin(a) * 1.4);
  }), []);
  const holoBeamGeo = useMemo(() => new THREE.CylinderGeometry(0.015, 0.015, 1.3, 6, 1, true), []);
  const holoBeamMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#22d3ee", transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), []);

  const jobPos = useMemo(() => Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * 2.25, Math.sin(a) * 1.1, -0.4);
  }), []);
  const jobLineGeo = useMemo(() => {
    const arr = new Float32Array(jobPos.length * 6);
    jobPos.forEach((p, i) => {
      arr[i * 6] = 0; arr[i * 6 + 1] = 0; arr[i * 6 + 2] = 0;
      arr[i * 6 + 3] = p.x; arr[i * 6 + 4] = p.y; arr[i * 6 + 5] = p.z;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [jobPos]);

  const ringPointsGeo = useMemo(() => makeRingPoints(80, 1.55), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      window.removeEventListener("pointermove", onMove);
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    return () => {
      cardGeo.dispose(); cardTex.dispose(); auraTex.dispose(); shadowTex.dispose();
      dustGeo.dispose(); starsGeo.dispose(); gridGeo.dispose(); traitLineGeo.dispose();
      holoBeamGeo.dispose(); jobLineGeo.dispose(); ringPointsGeo.dispose(); burst.g.dispose();
      nebulaTex.dispose(); rayTex.dispose(); nebulaGeo.dispose(); rayGeo.dispose();
      ringGeo.dispose(); ringGeo2.dispose(); hudRingGeo.dispose(); discGeo.dispose();
      cardCylGeo.dispose(); bowlGeo.dispose(); bowlCapGeo.dispose(); pedGeo.dispose(); baseGeo.dispose();
      letterGeo.dispose();
      [nTex, eTex, sTex, wTex].forEach(t => t.dispose());
      [brassMat, brassDarkMat, steelMat, redMat, glassMat, coreMat, auraMat, dustMat, starsMat, burstMat, gridMat, trailMat, trailLineMat, holoMat, jobMat, jobLineMat, pulseMatA, pulseMatB, holoBeamMat, ringMat, hudRingMat, rayMat, nebulaMat, streakMat, bokehMat, glowDiscMat, sweepMat, tickMat].forEach(m => m.dispose());
      letterMats.forEach(m => m.dispose());
      careerMats.forEach(m => m.dispose());
      riskMats.forEach(m => m.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const s = typeof slide === "number" ? slide : slide.current;
    disp.current += (s - disp.current) * Math.min(1, delta * 2.2);
    const d = disp.current;

    const i0 = Math.max(0, Math.min(6, Math.floor(d)));
    const i1 = Math.max(0, Math.min(6, i0 + 1));
    const f = Math.max(0, Math.min(1, d - i0));
    const col = new THREE.Color(SLIDE_COLORS[i0]).lerp(new THREE.Color(SLIDE_COLORS[i1]), f);

    auraMat.color.copy(col);
    auraMat.opacity = 0.5 + 0.15 * Math.sin(t * 1.1);
    coreMat.color.copy(col);
    coreMat.opacity = 0.8 + 0.2 * Math.sin(t * 1.6);
    if (light.current) {
      light.current.color.copy(col);
      light.current.intensity = 30 + 8 * Math.sin(t * 0.9);
    }

    if (spin.current) {
      spin.current.rotation.y = Math.sin(t * 0.24) * 0.12;
      spin.current.position.y = 0.15 + Math.sin(t * 1.3) * 0.06;
      spin.current.scale.setScalar(1 + punch.current * 0.05);
    }
    if (tilt.current) {
      tilt.current.rotation.x += (mouse.current.y * 0.12 - tilt.current.rotation.x) * 0.04;
      tilt.current.rotation.z += (-mouse.current.x * 0.16 - tilt.current.rotation.z) * 0.04;
    }
    if (card.current) card.current.rotation.z = t * 0.14;
    if (needle.current) needle.current.rotation.z = Math.sin(t * 0.8) * 0.18 + Math.sin(t * 1.7) * 0.05;
    if (sweepRing.current) sweepRing.current.rotation.z = t * 0.5;

    if (nebula.current) nebula.current.rotation.y += delta * 0.006;
    if (rings.current) {
      rings.current.rotation.y += delta * 0.14;
      rings.current.rotation.z += delta * 0.02;
    }
    if (hudRing.current) {
      hudRing.current.rotation.z += delta * 0.06;
      hudRing.current.rotation.x = 0.2 + Math.sin(t * 0.4) * 0.08;
    }
    ringMat.opacity = 0.28 + 0.2 * Math.sin(t * 0.5);
    hudRingMat.opacity = 0.22 + 0.16 * Math.sin(t * 0.8);
    rayMat.opacity = 0.1 + 0.05 * Math.sin(t * 0.9);
    sweepMat.opacity = 0.35;
    glowDiscMat.color.copy(col);
    if (glowDisc.current) glowDisc.current.scale.setScalar(1 + Math.sin(t * 0.9) * 0.05);
    streakMat.color.copy(col);
    streakMat.opacity = 0.22 + 0.1 * Math.sin(t * 1.4) + mouse.current.x * 0.08;
    if (streak.current) {
      streak.current.position.x = 1.7 - mouse.current.x * 0.55;
      streak.current.position.y = 0.9 - mouse.current.y * 0.4;
    }
    bokehMat.opacity = 0.34 + 0.1 * Math.sin(t * 0.7);
    if (bokehGroup.current) {
      bokehGroup.current.children.forEach((sprite, i) => {
        const b = bokeh[i];
        sprite.position.y += Math.sin(t * b.v + b.ph) * delta * 0.09;
        sprite.position.x += Math.cos(t * b.v * 0.8 + b.ph) * delta * 0.05;
        const tw = 0.7 + 0.3 * Math.sin(t * 3 + b.ph);
        sprite.scale.setScalar(b.s * (1 + tw * 0.25));
      });
    }

    const half = d + 0.5;
    const curInt = Math.floor(half);
    if (curInt !== lastInt.current) { lastInt.current = curInt; punch.current = 1; }
    punch.current *= Math.pow(0.02, delta);

    const f0 = fadeS(d, 0);
    const f1 = fadeS(d, 1);
    const f2 = fadeS(d, 2);
    const f3 = fadeS(d, 3);
    const f4 = fadeS(d, 4);
    const f5 = fadeS(d, 5);
    const f6 = fadeS(d, 6);

    glowDiscMat.opacity = (0.42 + 0.16 * Math.sin(t * 1.2)) * (0.5 + 0.5 * Math.max(f0, f6));

    starsMat.opacity = 0.15 + f0 * 0.45;
    dustMat.opacity = 0.35 + (f1 + f2 + f4 + f5) * 0.15;

    if (pulseA.current) {
      const p = (t * 0.35) % 1;
      pulseA.current.scale.setScalar(0.4 + p * 2.6);
      pulseMatA.opacity = (1 - p) * f0 * 0.7;
      const p2 = ((t * 0.35 + 0.5) % 1);
      pulseB.current.scale.setScalar(0.4 + p2 * 2.6);
      pulseMatB.opacity = (1 - p2) * (f0 * 0.5 + f6 * 0.6);
    }

    if (traitOrbit.current) traitOrbit.current.rotation.z = t * 0.22;
    const traitF = f1;
    groups[0].current.visible = traitF > 0.01;
    if (groups[0].current) groups[0].current.scale.setScalar(0.7 + 0.3 * traitF);
    trailMat.opacity = 0.85 * traitF;
    trailLineMat.opacity = 0.85 * traitF;

    const careerF = f2;
    groups[1].current.visible = careerF > 0.01;
    if (groups[1].current) groups[1].current.scale.setScalar(0.75 + 0.25 * careerF);
    const hot = Math.floor(t / 1.1) % 5;
    careerMats.forEach((m, i) => {
      const glow = 0.4 + 0.9 * Math.max(0, 1 - Math.abs(((t % 1.1) / 1.1) - (i === hot ? 0.5 : -1)) * 2);
      m.emissiveIntensity = careerF * (i === hot ? 1.6 : 0.35 + glow * 0.3);
      m.opacity = 0.3 + 0.7 * careerF;
    });

    const gridF = f3;
    groups[2].current.visible = gridF > 0.01;
    if (groups[2].current) groups[2].current.scale.setScalar(0.8 + 0.2 * gridF);
    gridMat.opacity = 0.05 + gridF * 0.3;
    riskMats.forEach((m, i) => {
      const pulse = 0.5 + 0.3 * Math.sin(t * 2.2 + i);
      m.emissiveIntensity = gridF * (0.3 + 0.8 * (m.color.getHex() === 0x34d399 ? 0.3 + pulse : 0.2));
    });

    const holoF = f4;
    groups[3].current.visible = holoF > 0.01;
    if (groups[3].current) groups[3].current.scale.setScalar(0.7 + 0.3 * holoF);
    if (holoSpin.current) holoSpin.current.rotation.y = t * 0.3;
    holoMat.opacity = 0.9 * holoF;
    (holoBeamMat as THREE.MeshBasicMaterial).opacity = 0.4 * holoF;

    const jobF = f5;
    groups[4].current.visible = jobF > 0.01;
    if (groups[4].current) groups[4].current.scale.setScalar(0.72 + 0.28 * jobF);
    if (jobSpin.current) jobSpin.current.rotation.z = t * 0.1;
    jobMat.opacity = 0.9 * jobF;
    (jobLineMat as THREE.LineBasicMaterial).opacity = 0.55 * jobF;

    const finF = f6;
    groups[5].current.visible = finF > 0.01;
    if (groups[5].current) groups[5].current.scale.setScalar(0.6 + 0.4 * finF);
    burstMat.opacity = finF;
    if (groups[5].current && burst.g) {
      const pos = (burst.g.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < 140; i++) {
        pos[i * 3] += burst.vel[i * 3] * delta * finF * 2.2;
        pos[i * 3 + 1] += burst.vel[i * 3 + 1] * delta * finF * 2.2;
        pos[i * 3 + 2] += burst.vel[i * 3 + 2] * delta * finF * 2.2;
        const r2 = pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2;
        if (r2 > 30) { pos[i * 3] = 0; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = 0; }
      }
      (burst.g.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    }

    const cam = state.camera;
    const a = CAMS[i0];
    const b = CAMS[i1];
    const swayX = Math.sin(t * 0.6) * 0.05 + Math.sin(t * 1.7) * 0.025;
    const swayY = Math.cos(t * 0.8) * 0.04 + Math.sin(t * 2.1) * 0.02;
    const tx = a[0] + (b[0] - a[0]) * f + mouse.current.x * 0.55 + swayX;
    const ty = a[1] + (b[1] - a[1]) * f - mouse.current.y * 0.35 + swayY;
    const tz = a[2] + (b[2] - a[2]) * f + punch.current * 0.55;
    cam.position.x += (tx - cam.position.x) * 0.06;
    cam.position.y += (ty - cam.position.y) * 0.06;
    cam.position.z += (tz - cam.position.z) * 0.06;
    cam.lookAt(0, 0, 0);
    cam.rotation.z += Math.sin(t * 0.4) * 0.014 + punch.current * 0.02;
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#fff1d6" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#818cf8" />
      <pointLight ref={light} position={[0, 0.5, 3]} intensity={30} color="#f59e0b" />

      <mesh ref={nebula} geometry={nebulaGeo}>
        <primitive object={nebulaMat} attach="material" />
      </mesh>

      <group ref={rings}>
        <mesh rotation={[1.05, 0.25, 0]}>
          <primitive object={ringGeo} attach="geometry" />
          <primitive object={ringMat} attach="material" />
        </mesh>
        <mesh rotation={[-0.8, -0.4, 0.2]}>
          <primitive object={ringGeo2} attach="geometry" />
          <primitive object={ringMat} attach="material" />
        </mesh>
      </group>

      <primitive object={hudLine} ref={hudRing} />

      <group ref={rays}>
        <mesh position={[-3.4, 2.6, -2.5]} rotation={[0, 0, 0.7]}>
          <primitive object={rayGeo} attach="geometry" />
          <primitive object={rayMat} attach="material" />
        </mesh>
        <mesh position={[3.8, 3.1, -3.5]} rotation={[0, 0, -0.55]} scale={[1.4, 1.1, 1]}>
          <primitive object={rayGeo} attach="geometry" />
          <primitive object={rayMat} attach="material" />
        </mesh>
        <mesh position={[0.6, 3.4, -4]} rotation={[0, 0, 0.12]} scale={[0.8, 1.3, 1]}>
          <primitive object={rayGeo} attach="geometry" />
          <primitive object={rayMat} attach="material" />
        </mesh>
      </group>

      <mesh ref={glowDisc} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.46, 0]} geometry={discGeo}>
        <primitive object={glowDiscMat} attach="material" />
      </mesh>

      <sprite ref={streak} position={[1.7, 0.9, 1.1]} scale={[4.4, 0.34, 1]}>
        <primitive object={streakMat} attach="material" />
      </sprite>

      <group ref={bokehGroup}>
        {bokeh.map((b, i) => (
          <sprite key={i} position={[b.x, b.y, b.z]} scale={[b.s, b.s, 1]}>
            <primitive object={bokehMat} attach="material" />
          </sprite>
        ))}
      </group>

      <sprite ref={aura} scale={[7, 7, 1]} position={[0, 0.2, -1.5]}>
        <primitive object={auraMat} attach="material" />
      </sprite>

      <points geometry={dustGeo}>
        <primitive object={dustMat} attach="material" />
      </points>
      <points geometry={starsGeo}>
        <primitive object={starsMat} attach="material" />
      </points>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
        <planeGeometry args={[5.4, 5.4]} />
        <meshBasicMaterial map={shadowTex} transparent opacity={0.9} depthWrite={false} />
      </mesh>

      <group ref={spin} position={[0, 0.15, 0]}>
        <group ref={tilt}>
          <group position={[0, -0.72, 0]}>
            <mesh position={[0, -0.3, 0]} geometry={pedGeo}>
              <primitive object={brassDarkMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.62, 0]} geometry={baseGeo}>
              <primitive object={brassDarkMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.98, 0.035, 12, 64]} />
              <primitive object={brassMat} attach="material" />
            </mesh>
          </group>

          <mesh position={[0, -0.26, 0]} geometry={bowlGeo}>
            <primitive object={brassMat} attach="material" />
          </mesh>
          <mesh position={[0, -0.52, 0]} rotation={[Math.PI, 0, 0]} geometry={bowlCapGeo}>
            <primitive object={brassDarkMat} attach="material" />
          </mesh>

          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.16, 0.075, 20, 96]} />
            <primitive object={brassMat} attach="material" />
          </mesh>
          <mesh>
            <torusGeometry args={[1.16, 0.075, 20, 96]} />
            <primitive object={brassMat} attach="material" />
          </mesh>

          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.sin(a) * 1.17, Math.cos(a) * 1.17, 0.14]} rotation={[0, 0, -a]}>
                <boxGeometry args={[0.05, 0.11, 0.06]} />
                <primitive object={tickMat} attach="material" />
              </mesh>
            );
          })}

          <group ref={card} position={[0, 0, 0]}>
            <mesh geometry={cardCylGeo}>
              <primitive object={brassDarkMat} attach="material" />
            </mesh>
            <mesh geometry={cardGeo} position={[0, 0, 0.035]}>
              <meshBasicMaterial map={cardTex} />
            </mesh>
            <mesh position={[0, 0, 0.035]}>
              <torusGeometry args={[1.0, 0.03, 12, 96]} />
              <primitive object={brassMat} attach="material" />
            </mesh>
            {Array.from({ length: 36 }, (_, i) => {
              const a = (i / 36) * Math.PI * 2;
              const major = i % 9 === 0;
              return (
                <mesh key={i} position={[Math.sin(a) * (major ? 0.94 : 0.92), Math.cos(a) * (major ? 0.94 : 0.92), 0.05]} rotation={[0, 0, -a]}>
                  <boxGeometry args={[major ? 0.022 : 0.014, major ? 0.07 : 0.045, 0.018]} />
                  <primitive object={tickMat} attach="material" />
                </mesh>
              );
            })}
          </group>

          {LETTERS.map((l, i) => (
            <group key={l.ch} position={[l.x, l.y, 0.07]}>
              <mesh geometry={letterGeo}>
                <primitive object={letterMats[i]} attach="material" />
              </mesh>
              <sprite scale={[0.5, 0.5, 1]} position={[0, 0, -0.02]}>
                <primitive object={auraMat} attach="material" />
              </sprite>
            </group>
          ))}

          <mesh ref={sweepRing} position={[0, 0, 0.04]}>
            <torusGeometry args={[1.0, 0.012, 8, 96]} />
            <primitive object={sweepMat} attach="material" />
          </mesh>

          <group ref={needle} position={[0, 0, 0.08]}>
            <mesh position={[0, 0.28, 0]}>
              <coneGeometry args={[0.05, 0.56, 6]} />
              <primitive object={redMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.28, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.05, 0.56, 6]} />
              <primitive object={steelMat} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.1, 20]} />
              <primitive object={brassDarkMat} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <sphereGeometry args={[0.07, 20, 16]} />
              <primitive object={coreMat} attach="material" />
            </mesh>
          </group>

          <mesh position={[0, 0, 0.12]}>
            <sphereGeometry args={[1.18, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <primitive object={glassMat} attach="material" />
          </mesh>

          <mesh ref={pulseA} position={[0, 0, 0.1]}>
            <torusGeometry args={[1.0, 0.02, 8, 64]} />
            <primitive object={pulseMatA} attach="material" />
          </mesh>
          <mesh ref={pulseB} position={[0, 0, 0.11]}>
            <torusGeometry args={[1.0, 0.02, 8, 64]} />
            <primitive object={pulseMatB} attach="material" />
          </mesh>

          <group ref={groups[0]}>
            <group ref={traitOrbit}>
              {traitPos.map((p, i) => (
                <mesh key={i} position={p}>
                  <octahedronGeometry args={[0.16, 0]} />
                  <primitive object={trailMat} attach="material" />
                </mesh>
              ))}
            </group>
            <lineSegments geometry={traitLineGeo}>
              <primitive object={trailLineMat} attach="material" />
            </lineSegments>
          </group>

          <group ref={groups[1]}>
            {careerPos.map((p, i) => (
              <mesh key={i} position={p} ref={el => { if (el) careerNodes.current[i] = el; }}>
                <icosahedronGeometry args={[0.24, 0]} />
                <primitive object={careerMats[i]} attach="material" />
              </mesh>
            ))}
          </group>

          <group ref={groups[4]}>
            <group ref={jobSpin}>
              {jobPos.map((p, i) => (
                <mesh key={i} position={p}>
                  <circleGeometry args={[0.42, 32]} />
                  <primitive object={jobMat} attach="material" />
                </mesh>
              ))}
            </group>
            <lineSegments geometry={jobLineGeo}>
              <primitive object={jobLineMat} attach="material" />
            </lineSegments>
          </group>

          <group ref={groups[3]}>
            <group ref={holoSpin}>
              {holoPos.map((p, i) => (
                <group key={i} position={p}>
                  <mesh position={[0, -0.55, 0]}>
                    <primitive object={holoBeamGeo} attach="geometry" />
                    <primitive object={holoBeamMat} attach="material" />
                  </mesh>
                  <mesh>
                    <octahedronGeometry args={[0.2, 0]} />
                    <primitive object={holoMat} attach="material" />
                  </mesh>
                </group>
              ))}
            </group>
            <points geometry={ringPointsGeo} position={[0, 1.15, 0]}>
              <primitive object={holoMat} attach="material" />
            </points>
          </group>
        </group>
      </group>

      <group ref={groups[2]}>
        <lineSegments geometry={gridGeo} position={[0, -1.6, 0]}>
          <primitive object={gridMat} attach="material" />
        </lineSegments>
        {riskMats.map((m, i) => {
          const x = (i - 2) * 1.1;
          const h = i < 2 ? 0.7 + i * 0.35 : 1.4 - (i - 2) * 0.3;
          return (
            <mesh key={i} position={[x, -1.6 + h / 2, 0]}>
              <boxGeometry args={[0.3, h, 0.3]} />
              <primitive object={m} attach="material" />
            </mesh>
          );
        })}
      </group>

      <group ref={groups[5]}>
        <points geometry={burst.g}>
          <primitive object={burstMat} attach="material" />
        </points>
      </group>
    </>
  );
}

class HeroBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroCompass({ slide }: { slide: SlideInput }) {
  return (
    <HeroBoundary>
      <Canvas camera={{ position: [0, 0.5, 7.6], fov: 42 }} dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} style={{ pointerEvents: "none" }}>
        <HeroInner slide={slide} />
      </Canvas>
    </HeroBoundary>
  );
}
