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
    ctx.beginPath();
    ctx.moveTo(512 + Math.sin(rad) * 470, 512 - Math.cos(rad) * 470);
    ctx.lineTo(512 + Math.sin(rad) * (long ? 408 : med ? 448 : 466), 512 - Math.cos(rad) * (long ? 408 : med ? 448 : 466));
    ctx.strokeStyle = long ? "#1a1a1a" : med ? "#3a3a3a" : "#6a6a6a";
    ctx.lineWidth = long ? 10 : med ? 6 : 3;
    ctx.stroke();
  }
  ctx.font = "900 64px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  [["N", 512, 512 - 342, "#c0392b"], ["E", 512 + 342, 512, "#1a1a1a"], ["S", 512, 512 + 342, "#1a1a1a"], ["W", 512 - 342, 512, "#1a1a1a"]].forEach(([t, x, y, col]) => {
    ctx.fillStyle = col as string;
    ctx.fillText(t as string, x as number, y as number);
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

function HeroInner({ slide }: { slide: number }) {
  const { gl, scene } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const disp = useRef(slide);
  const spin = useRef<THREE.Group>(null!);
  const tilt = useRef<THREE.Group>(null!);
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

  const cardTex = useMemo(() => makeCardTexture(), []);
  const cardGeo = useMemo(() => new THREE.CircleGeometry(1.3, 96), []);
  const auraTex = useMemo(() => makeGlowTexture("rgba(255,255,255,0.9)", "rgba(255,255,255,0.22)"), []);
  const shadowTex = useMemo(() => makeShadowTexture(), []);
  const dustGeo = useMemo(() => makeDust(130, 2.4, 6.4), []);
  const starsGeo = useMemo(() => makeDust(90, 4.5, 8.5), []);
  const gridGeo = useMemo(() => makeGrid(), []);

  const brassMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#b08a3e", metalness: 1, roughness: 0.3 }), []);
  const brassDarkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#8a6a2f", metalness: 1, roughness: 0.42 }), []);
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
      [brassMat, brassDarkMat, steelMat, redMat, glassMat, coreMat, auraMat, dustMat, starsMat, burstMat, gridMat, trailMat, trailLineMat, holoMat, jobMat, jobLineMat, pulseMatA, pulseMatB, holoBeamMat].forEach(m => m.dispose());
      careerMats.forEach(m => m.dispose());
      riskMats.forEach(m => m.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    disp.current += (slide - disp.current) * Math.min(1, delta * 2.2);
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
      spin.current.rotation.y = t * 0.22;
      spin.current.position.y = 0.15 + Math.sin(t * 1.3) * 0.06;
    }
    if (tilt.current) {
      tilt.current.rotation.x += (mouse.current.y * 0.12 - tilt.current.rotation.x) * 0.04;
      tilt.current.rotation.z += (-mouse.current.x * 0.16 - tilt.current.rotation.z) * 0.04;
    }
    if (needle.current) needle.current.rotation.z = t * 0.16 + Math.sin(t * 0.4) * 0.03;

    const f0 = fadeS(d, 0);
    const f1 = fadeS(d, 1);
    const f2 = fadeS(d, 2);
    const f3 = fadeS(d, 3);
    const f4 = fadeS(d, 4);
    const f5 = fadeS(d, 5);
    const f6 = fadeS(d, 6);

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
    const tx = a[0] + (b[0] - a[0]) * f + mouse.current.x * 0.5;
    const ty = a[1] + (b[1] - a[1]) * f - mouse.current.y * 0.3;
    const tz = a[2] + (b[2] - a[2]) * f;
    cam.position.x += (tx - cam.position.x) * 0.06;
    cam.position.y += (ty - cam.position.y) * 0.06;
    cam.position.z += (tz - cam.position.z) * 0.06;
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#fff1d6" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#818cf8" />
      <pointLight ref={light} position={[0, 0.5, 3]} intensity={30} color="#f59e0b" />

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

      <group ref={spin}>
        <group ref={tilt}>
          <mesh>
            <torusGeometry args={[1.36, 0.14, 24, 96]} />
            <primitive object={brassMat} attach="material" />
          </mesh>
          <mesh>
            <torusGeometry args={[1.22, 0.05, 16, 96]} />
            <primitive object={brassDarkMat} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.12]}>
            <cylinderGeometry args={[1.36, 1.36, 0.34, 96, 1, true]} />
            <primitive object={brassDarkMat} attach="material" />
            <primitive object={brassMat} attach="material" />
          </mesh>
          <mesh geometry={cardGeo} position={[0, 0, -0.06]}>
            <meshBasicMaterial map={cardTex} />
          </mesh>
          <group ref={needle}>
            <mesh position={[0, 0.52, 0.02]}><boxGeometry args={[0.1, 1.04, 0.02]} /><primitive object={redMat} attach="material" /></mesh>
            <mesh position={[0, -0.52, 0.02]}><boxGeometry args={[0.1, 1.04, 0.02]} /><primitive object={steelMat} attach="material" /></mesh>
            <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.09, 0.09, 0.12, 20]} /><primitive object={brassDarkMat} attach="material" /></mesh>
          </group>
          <mesh position={[0, 0, 0.1]}><sphereGeometry args={[0.1, 20, 16]} /><primitive object={coreMat} attach="material" /></mesh>
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[1.34, 48, 32]} />
            <primitive object={glassMat} attach="material" />
          </mesh>

          <mesh ref={pulseA} position={[0, 0, 0.12]}>
            <torusGeometry args={[1.0, 0.02, 8, 64]} />
            <primitive object={pulseMatA} attach="material" />
          </mesh>
          <mesh ref={pulseB} position={[0, 0, 0.13]}>
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

export default function HeroCompass({ slide }: { slide: number }) {
  return (
    <HeroBoundary>
      <Canvas camera={{ position: [0, 0.5, 7.6], fov: 42 }} dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} style={{ pointerEvents: "none" }}>
        <HeroInner slide={slide} />
      </Canvas>
    </HeroBoundary>
  );
}
