"use client";

import { Component, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const FEATURE_COLORS = [
  "#f59e0b",
  "#f59e0b", "#22d3ee", "#a855f7", "#f472b6", "#10b981", "#34d399", "#818cf8", "#f97316",
  "#fbbf24",
];
const CAMS = [
  [0.0, 0.35, 7.9],
  [0.25, 0.55, 6.9],
  [-0.15, 0.7, 6.5],
  [0.55, 0.4, 6.3],
  [-0.35, 0.3, 6.1],
  [0.0, 0.9, 6.7],
  [0.45, 0.3, 6.3],
  [-0.25, 0.6, 6.6],
  [0.35, 0.5, 6.4],
  [0.0, 0.25, 5.3],
] as const;

const smooth = (x: number) => {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
};

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
  g.addColorStop(0, "rgba(0,0,0,0.65)");
  g.addColorStop(0.55, "rgba(0,0,0,0.3)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function makeDegreeRingTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 1024, 1024);
  const P = 360;
  ctx.font = "700 38px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let a = 0; a < 360; a += 2) {
    const rad = (a * Math.PI) / 180;
    const major = a % 10 === 0;
    const med = a % 5 === 0;
    const r1 = 1.09;
    const r2 = major ? 1.3 : med ? 1.25 : 1.21;
    ctx.strokeStyle = major ? "rgba(34,22,6,0.9)" : med ? "rgba(34,22,6,0.6)" : "rgba(34,22,6,0.35)";
    ctx.lineWidth = major ? 6 : med ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(512 + Math.sin(rad) * P * r1, 512 - Math.cos(rad) * P * r1);
    ctx.lineTo(512 + Math.sin(rad) * P * r2, 512 - Math.cos(rad) * P * r2);
    ctx.stroke();
    if (major) {
      const lab = a === 0 ? "N" : a === 90 ? "E" : a === 180 ? "S" : a === 270 ? "W" : String(a % 360 === 0 ? 0 : a);
      ctx.fillStyle = a % 90 === 0 ? "rgba(150,26,14,0.95)" : "rgba(34,22,6,0.85)";
      ctx.fillText(lab, 512 + Math.sin(rad) * P * 1.335, 512 - Math.cos(rad) * P * 1.335);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
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

type SlideInput = number | { current: number };

function HeroInner({ feature }: { feature: SlideInput }) {
  const { gl, scene } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const disp = useRef(typeof feature === "number" ? feature : feature.current);
  const rock = useRef<THREE.Group>(null!);
  const tilt = useRef<THREE.Group>(null!);
  const card = useRef<THREE.Group>(null!);
  const masterNeedle = useRef<THREE.Group>(null!);
  const light = useRef<THREE.PointLight>(null!);
  const aura = useRef<THREE.Sprite>(null!);
  const nebula = useRef<THREE.Mesh>(null!);
  const rings = useRef<THREE.Group>(null!);
  const rays = useRef<THREE.Group>(null!);
  const hudRing = useRef<THREE.Line>(null!);
  const glowDisc = useRef<THREE.Mesh>(null!);
  const streak = useRef<THREE.Sprite>(null!);
  const bokehGroup = useRef<THREE.Group>(null!);
  const tipGlow = useRef<THREE.Sprite>(null!);
  const needleMats = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const lastInt = useRef(-1);
  const punch = useRef(0);
  const cardAngle = useRef(Math.PI * 3);
  const needleAngle = useRef(0);

  const bokeh = useMemo(() => makeBokeh(), []);
  const auraTex = useMemo(() => makeGlowTexture("rgba(255,255,255,0.9)", "rgba(255,255,255,0.22)"), []);
  const shadowTex = useMemo(() => makeShadowTexture(), []);
  const degreeTex = useMemo(() => makeDegreeRingTexture(), []);
  const dustGeo = useMemo(() => makeDust(130, 2.4, 6.4), []);
  const starsGeo = useMemo(() => makeDust(90, 4.5, 8.5), []);
  const nebulaTex = useMemo(() => makeNebulaTexture(), []);
  const rayTex = useMemo(() => makeRayTexture(), []);
  const nebulaGeo = useMemo(() => new THREE.SphereGeometry(42, 32, 16), []);
  const rayGeo = useMemo(() => new THREE.PlaneGeometry(1.6, 11), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(2.35, 0.014, 8, 128), []);
  const ringGeo2 = useMemo(() => new THREE.TorusGeometry(2.7, 0.01, 8, 128), []);
  const hudRingGeo = useMemo(() => makeCircleLine(96, 2.9), []);
  const discGeo = useMemo(() => new THREE.CircleGeometry(3.6, 48), []);
  const cardGeo = useMemo(() => new THREE.CircleGeometry(1.0, 96), []);
  const cardCylGeo = useMemo(() => new THREE.CylinderGeometry(1.0, 1.0, 0.07, 96, 1, true), []);
  const bowlGeo = useMemo(() => new THREE.CylinderGeometry(1.28, 0.8, 0.5, 64, 1, true), []);
  const bowlCapGeo = useMemo(() => new THREE.CircleGeometry(0.8, 48), []);
  const pedGeo = useMemo(() => new THREE.CylinderGeometry(0.52, 0.78, 0.44, 48), []);
  const baseGeo = useMemo(() => new THREE.CylinderGeometry(1.0, 1.06, 0.1, 48), []);
  const ringPlateGeo = useMemo(() => new THREE.CircleGeometry(1.42, 96), []);
  const needleGeo = useMemo(() => new THREE.ConeGeometry(0.24, 0.95, 4), []);
  const masterNGeo = useMemo(() => new THREE.ConeGeometry(0.055, 0.7, 8), []);
  const masterSGeo = useMemo(() => new THREE.ConeGeometry(0.055, 0.7, 8), []);
  const lubberGeo = useMemo(() => new THREE.ConeGeometry(0.09, 0.26, 4), []);

  const brassMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#c39a3b", metalness: 1, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.12 }), []);
  const brassDarkMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#7d5f28", metalness: 1, roughness: 0.42, clearcoat: 0.6 }), []);
  const steelMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#e8e8e8", metalness: 0.95, roughness: 0.22 }), []);
  const redMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#c0392b", metalness: 0.6, roughness: 0.3, clearcoat: 0.8 }), []);
  const goldMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#e6c25e", metalness: 1, roughness: 0.12, clearcoat: 1 }), []);
  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffffff", metalness: 0, roughness: 0.05, transmission: 0.92, thickness: 0.3, ior: 1.5,
    clearcoat: 1, clearcoatRoughness: 0.06, transparent: true, opacity: 0.9, depthWrite: false,
  }), []);
  const degreeMat = useMemo(() => new THREE.MeshBasicMaterial({ map: degreeTex, transparent: true, opacity: 1, side: THREE.DoubleSide, depthWrite: false }), [degreeTex]);
  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#f59e0b", transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const auraMat = useMemo(() => new THREE.SpriteMaterial({ map: auraTex, color: "#f59e0b", transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }), [auraTex]);
  const dustMat = useMemo(() => new THREE.PointsMaterial({ color: "#f5d78e", size: 0.025, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), []);
  const starsMat = useMemo(() => new THREE.PointsMaterial({ color: "#cfe0ff", size: 0.035, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), []);
  const ringMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#8b8bff", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const hudRingMat = useMemo(() => new THREE.LineBasicMaterial({ color: "#cfe0ff", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const hudLine = useMemo(() => new THREE.Line(hudRingGeo, hudRingMat), [hudRingGeo, hudRingMat]);
  const rayMat = useMemo(() => new THREE.MeshBasicMaterial({ map: rayTex, color: "#ffffff", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), [rayTex]);
  const nebulaMat = useMemo(() => new THREE.MeshBasicMaterial({ map: nebulaTex, color: "#ffffff", side: THREE.BackSide, depthWrite: false, transparent: true }), [nebulaTex]);
  const streakMat = useMemo(() => new THREE.SpriteMaterial({ map: auraTex, color: "#f59e0b", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), [auraTex]);
  const bokehMat = useMemo(() => new THREE.SpriteMaterial({ map: auraTex, color: "#ffffff", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), [auraTex]);
  const glowDiscMat = useMemo(() => new THREE.MeshBasicMaterial({ map: auraTex, color: "#f59e0b", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), [auraTex]);
  const burst = useMemo(() => makeBurst(160), []);
  const burstMat = useMemo(() => new THREE.PointsMaterial({ color: "#ffd98a", size: 0.09, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), []);

  const needleM = useMemo(() => FEATURE_COLORS.slice(1, 9).map(col => {
    const m = new THREE.MeshPhysicalMaterial({ color: "#d8c38a", metalness: 0.9, roughness: 0.25, clearcoat: 0.8, emissive: new THREE.Color(col), emissiveIntensity: 0.15 });
    return m;
  }), []);
  useEffect(() => { needleMats.current = needleM; }, [needleM]);
  const tipGlowMat = useMemo(() => new THREE.SpriteMaterial({ map: auraTex, color: "#ffffff", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), [auraTex]);

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
      auraTex.dispose(); shadowTex.dispose(); degreeTex.dispose();
      dustGeo.dispose(); starsGeo.dispose(); nebulaGeo.dispose(); rayGeo.dispose();
      ringGeo.dispose(); ringGeo2.dispose(); hudRingGeo.dispose(); discGeo.dispose();
      cardGeo.dispose(); cardCylGeo.dispose(); bowlGeo.dispose(); bowlCapGeo.dispose();
      pedGeo.dispose(); baseGeo.dispose(); ringPlateGeo.dispose(); needleGeo.dispose();
      masterNGeo.dispose(); masterSGeo.dispose(); lubberGeo.dispose(); burst.g.dispose();
      nebulaTex.dispose(); rayTex.dispose();
      [brassMat, brassDarkMat, steelMat, redMat, goldMat, glassMat, degreeMat, coreMat, auraMat, dustMat, starsMat, ringMat, hudRingMat, rayMat, nebulaMat, streakMat, bokehMat, glowDiscMat, burstMat, tipGlowMat].forEach(m => m.dispose());
      needleM.forEach(m => m.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const f = typeof feature === "number" ? feature : feature.current;
    disp.current += (f - disp.current) * Math.min(1, delta * 2.2);
    const d = disp.current;

    const idx = Math.max(0, Math.min(9, Math.round(d)));
    const col = new THREE.Color(FEATURE_COLORS[idx]);

    auraMat.color.copy(col);
    auraMat.opacity = 0.5 + 0.15 * Math.sin(t * 1.1);
    coreMat.color.copy(col);
    coreMat.opacity = 0.8 + 0.2 * Math.sin(t * 1.6);
    glowDiscMat.color.copy(col);
    if (light.current) {
      light.current.color.copy(col);
      light.current.intensity = 30 + 8 * Math.sin(t * 0.9);
    }

    if (rock.current) {
      rock.current.rotation.y = Math.sin(t * 0.24) * 0.1;
      rock.current.position.y = 0.15 + Math.sin(t * 1.3) * 0.05;
      rock.current.scale.setScalar(1 + punch.current * 0.05);
    }
    if (tilt.current) {
      tilt.current.rotation.x += (mouse.current.y * 0.1 - tilt.current.rotation.x) * 0.04;
      tilt.current.rotation.z += (-mouse.current.x * 0.14 - tilt.current.rotation.z) * 0.04;
    }

    const featFloat = Math.max(0, Math.min(7, d - 1));
    const targetAngle = THREE.MathUtils.degToRad(-featFloat * 45);
    cardAngle.current += (targetAngle - cardAngle.current) * Math.min(1, delta * (d < 1 ? 2.4 : 3.4));
    if (card.current) card.current.rotation.z = cardAngle.current + Math.sin(t * 0.7) * 0.008;

    const needleTarget = THREE.MathUtils.degToRad(featFloat * 45);
    needleAngle.current += (needleTarget - needleAngle.current) * Math.min(1, delta * 2.4);
    if (masterNeedle.current) masterNeedle.current.rotation.z = needleAngle.current + Math.sin(t * 1.1) * 0.04;

    if (needleMats.current.length === 8) {
      needleMats.current.forEach((m, j) => {
        const g2 = smooth(Math.max(0, 1 - Math.abs(j - featFloat) * 1.4));
        m.emissiveIntensity = 0.15 + g2 * 2.6;
        m.emissiveIntensity += 0.2 * Math.sin(t * 2 + j);
      });
    }

    if (tipGlow.current) {
      const j = Math.max(0, Math.min(7, Math.round(featFloat)));
      const a = THREE.MathUtils.degToRad(j * 45);
      tipGlow.current.position.set(Math.sin(a) * 1.02, Math.cos(a) * 1.02, 0.06);
      tipGlowMat.color.copy(col);
      tipGlowMat.opacity = (0.5 + 0.2 * Math.sin(t * 2.5)) * Math.max(0, 1 - Math.abs(featFloat - j) * 1.2);
    }

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
    glowDiscMat.opacity = 0.5 + 0.18 * Math.sin(t * 1.2);
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

    const finF = Math.max(0, Math.min(1, d - 8.5));
    burstMat.opacity = finF;
    if (burst.g) {
      const pos = (burst.g.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < 160; i++) {
        pos[i * 3] += burst.vel[i * 3] * delta * finF * 2.4;
        pos[i * 3 + 1] += burst.vel[i * 3 + 1] * delta * finF * 2.4;
        pos[i * 3 + 2] += burst.vel[i * 3 + 2] * delta * finF * 2.4;
        const r2 = pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2;
        if (r2 > 30) { pos[i * 3] = 0; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = 0; }
      }
      (burst.g.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    }

    const cam = state.camera;
    const i0 = Math.max(0, Math.min(9, Math.floor(d)));
    const i1 = Math.max(0, Math.min(9, i0 + 1));
    const frac = Math.max(0, Math.min(1, d - i0));
    const a = CAMS[i0];
    const b = CAMS[i1];
    const swayX = Math.sin(t * 0.6) * 0.05 + Math.sin(t * 1.7) * 0.025;
    const swayY = Math.cos(t * 0.8) * 0.04 + Math.sin(t * 2.1) * 0.02;
    const tx = a[0] + (b[0] - a[0]) * frac + mouse.current.x * 0.55 + swayX;
    const ty = a[1] + (b[1] - a[1]) * frac - mouse.current.y * 0.35 + swayY;
    const tz = a[2] + (b[2] - a[2]) * frac + punch.current * 0.55;
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

      <mesh ref={glowDisc} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} geometry={discGeo}>
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

      <sprite ref={aura} scale={[7.4, 7.4, 1]} position={[0, 0.15, -1.6]}>
        <primitive object={auraMat} attach="material" />
      </sprite>

      <points geometry={dustGeo}>
        <primitive object={dustMat} attach="material" />
      </points>
      <points geometry={starsGeo}>
        <primitive object={starsMat} attach="material" />
      </points>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial map={shadowTex} transparent opacity={0.9} depthWrite={false} />
      </mesh>

      <group ref={rock} position={[0, 0.15, 0]}>
        <group ref={tilt}>
          <group position={[0, -0.72, 0]}>
            <mesh position={[0, -0.32, 0]} geometry={pedGeo}>
              <primitive object={brassDarkMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.65, 0]} geometry={baseGeo}>
              <primitive object={brassDarkMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.03, 0.04, 12, 72]} />
              <primitive object={brassMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.61, 0]}>
              <torusGeometry args={[0.62, 0.02, 8, 48]} />
              <primitive object={brassMat} attach="material" />
            </mesh>
          </group>

          <mesh position={[0, -0.25, 0]} geometry={bowlGeo}>
            <primitive object={brassMat} attach="material" />
          </mesh>
          <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]} geometry={bowlCapGeo}>
            <primitive object={brassDarkMat} attach="material" />
          </mesh>

          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.28, 0.09, 20, 96]} />
            <primitive object={brassMat} attach="material" />
          </mesh>
          <mesh>
            <torusGeometry args={[1.28, 0.09, 20, 96]} />
            <primitive object={brassMat} attach="material" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.47, 0.05, 16, 96]} />
            <primitive object={brassDarkMat} attach="material" />
          </mesh>

          <mesh geometry={ringPlateGeo} position={[0, 0, 0.12]}>
            <primitive object={degreeMat} attach="material" />
          </mesh>

          <group ref={card} position={[0, 0, 0]}>
            <mesh geometry={cardCylGeo}>
              <primitive object={brassDarkMat} attach="material" />
            </mesh>
            <mesh geometry={cardGeo} position={[0, 0, 0.035]}>
              <meshBasicMaterial map={undefined} color="#efe5c8" />
            </mesh>
            <mesh position={[0, 0, 0.035]}>
              <torusGeometry args={[1.0, 0.028, 12, 96]} />
              <primitive object={brassMat} attach="material" />
            </mesh>
            {needleM.map((m, j) => {
              const a = THREE.MathUtils.degToRad(j * 45);
              return (
                <mesh key={j} geometry={needleGeo} position={[Math.sin(a) * 0.55, Math.cos(a) * 0.55, 0.045]} rotation={[0, 0, a]}>
                  <primitive object={m} attach="material" />
                </mesh>
              );
            })}
            <sprite ref={tipGlow} scale={[1.3, 1.3, 1]}>
              <primitive object={tipGlowMat} attach="material" />
            </sprite>
            <mesh position={[0, 0, 0.05]}>
              <torusGeometry args={[0.22, 0.02, 8, 48]} />
              <primitive object={brassMat} attach="material" />
            </mesh>
          </group>

          <group ref={masterNeedle} position={[0, 0, 0.08]}>
            <mesh position={[0, 0.3, 0]} geometry={masterNGeo}>
              <primitive object={redMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]} geometry={masterSGeo}>
              <primitive object={steelMat} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.1, 20]} />
              <primitive object={goldMat} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <sphereGeometry args={[0.07, 20, 16]} />
              <primitive object={coreMat} attach="material" />
            </mesh>
          </group>

          <mesh position={[0, 1.18, 0.12]} rotation={[Math.PI, 0, 0]} geometry={lubberGeo}>
            <primitive object={goldMat} attach="material" />
          </mesh>
          <sprite scale={[0.55, 0.55, 1]} position={[0, 1.18, 0.14]}>
            <primitive object={auraMat} attach="material" />
          </sprite>

          <mesh position={[0, 0, 0.12]}>
            <sphereGeometry args={[1.55, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <primitive object={glassMat} attach="material" />
          </mesh>

          <points geometry={burst.g}>
            <primitive object={burstMat} attach="material" />
          </points>
        </group>
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

export default function HeroCompass({ feature }: { feature: SlideInput }) {
  return (
    <HeroBoundary>
      <Canvas camera={{ position: [0, 0.35, 7.9], fov: 42 }} dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} style={{ pointerEvents: "none" }}>
        <HeroInner feature={feature} />
      </Canvas>
    </HeroBoundary>
  );
}
