"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DIRS, headingFromDrag } from "@/lib/directions";

export interface DragState {
  x: number;
  y: number;
  active: boolean;
}

const CYAN = "#67e8f9";
const CORAL = "#fb7185";

function makeHoloFaceTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 1024, 1024);
  const cx = 512;
  const P = 470;
  const R = (r: number) => P * (r / 1.5);

  ctx.save();
  ctx.shadowColor = "rgba(103,232,249,0.9)";
  ctx.shadowBlur = 18;

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(cx, cx, R(1.46) - i * 2, 0, Math.PI * 2);
    ctx.strokeStyle = i === 0 ? "rgba(224,250,255,0.95)" : i === 1 ? "rgba(103,232,249,0.6)" : "rgba(103,232,249,0.28)";
    ctx.lineWidth = i === 0 ? 3 : 1.5;
    ctx.stroke();
  }

  for (let a = 0; a < 360; a += 2) {
    const rad = (a * Math.PI) / 180;
    const major = a % 10 === 0;
    const med = a % 5 === 0;
    const r1 = major ? 1.38 : med ? 1.34 : 1.3;
    const r2 = 1.05;
    ctx.strokeStyle = major ? "rgba(224,250,255,0.95)" : med ? "rgba(103,232,249,0.7)" : "rgba(103,232,249,0.4)";
    ctx.lineWidth = major ? 5 : med ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.sin(rad) * R(r1), cx - Math.cos(rad) * R(r1));
    ctx.lineTo(cx + Math.sin(rad) * R(r2), cx - Math.cos(rad) * R(r2));
    ctx.stroke();
  }

  const label = (ch: string, a: number, coral: boolean) => {
    const rad = (a * Math.PI) / 180;
    ctx.font = "900 46px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = coral ? "rgba(251,113,133,0.95)" : "rgba(103,232,249,0.95)";
    ctx.fillStyle = coral ? CORAL : "#dff7ff";
    ctx.fillText(ch, cx + Math.sin(rad) * R(0.88), cx - Math.cos(rad) * R(0.88));
  };
  label("N", 0, true);
  label("NE", 45, false);
  label("E", 90, false);
  label("SE", 135, false);
  label("S", 180, true);
  label("SW", 225, false);
  label("W", 270, false);
  label("NW", 315, false);

  ctx.shadowBlur = 0;
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(103,232,249,0.4)";
  [0.58, 0.32].forEach(rr => {
    ctx.beginPath();
    ctx.arc(cx, cx, R(rr), 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.shadowColor = "rgba(103,232,249,0.6)";
  ctx.shadowBlur = 10;
  ctx.strokeStyle = "rgba(103,232,249,0.55)";
  ctx.lineWidth = 4;
  [0, 45, 90, 135, 180, 225, 270, 315].forEach(a => {
    const rad = (a * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cx);
    ctx.lineTo(cx + Math.sin(rad) * R(0.52), cx - Math.cos(rad) * R(0.52));
    ctx.stroke();
  });

  ctx.beginPath();
  ctx.arc(cx, cx, R(0.09), 0, Math.PI * 2);
  ctx.fillStyle = "rgba(224,250,255,0.95)";
  ctx.fill();
  ctx.restore();

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

function makeNebulaTexture() {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 1024, 512);
  g.addColorStop(0, "#020412");
  g.addColorStop(0.35, "#081a33");
  g.addColorStop(0.62, "#04101f");
  g.addColorStop(1, "#02040d");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);
  const blobs: [string, number, number, number][] = [
    ["rgba(34,211,238,0.14)", 240, 160, 150],
    ["rgba(129,140,248,0.16)", 780, 200, 190],
    ["rgba(56,189,248,0.10)", 520, 300, 140],
    ["rgba(168,85,247,0.12)", 150, 380, 170],
    ["rgba(244,114,182,0.08)", 880, 370, 140],
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
  const size = 8;
  const step = 0.6;
  const lines: number[] = [];
  for (let i = -size; i <= size; i += step) {
    lines.push(-size, 0, i, size, 0, i);
    lines.push(i, 0, -size, i, 0, size);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lines), 3));
  return g;
}

function CompassInner({ dir, dragRef }: { dir: number | null; dragRef: DragState }) {
  const { gl, scene } = useThree();
  const float = useRef<THREE.Group>(null!);
  const card = useRef<THREE.Group>(null!);
  const needle = useRef<THREE.Group>(null!);
  const ringA = useRef<THREE.Group>(null!);
  const ringB = useRef<THREE.Group>(null!);
  const heading = useRef(0);
  const prevDir = useRef<number | null>(null);
  const punch = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const glowTex = useMemo(() => makeGlowTexture("rgba(255,255,255,0.95)", "rgba(255,255,255,0.25)"), []);
  const faceTex = useMemo(() => makeHoloFaceTexture(), []);
  const nebulaTex = useMemo(() => makeNebulaTexture(), []);
  const dustGeo = useMemo(() => makeDust(160, 2.2, 7.6), []);
  const gridGeo = useMemo(() => makeGrid(), []);

  const holoMat = useMemo(() => new THREE.MeshBasicMaterial({ map: faceTex, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }), [faceTex]);
  const needleMat = useMemo(() => new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const needleTipMat = useMemo(() => new THREE.MeshBasicMaterial({ color: CORAL, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const hubMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const ringMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#7dd3fc", transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const ringMat2 = useMemo(() => new THREE.MeshBasicMaterial({ color: "#a78bfa", transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const satMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#e0faff", transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const beamMat = useMemo(() => new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), []);
  const auraMat = useMemo(() => new THREE.SpriteMaterial({ map: glowTex, color: CYAN, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }), [glowTex]);
  const discMat = useMemo(() => new THREE.MeshBasicMaterial({ map: glowTex, color: CYAN, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), [glowTex]);
  const gridMat = useMemo(() => new THREE.LineBasicMaterial({ color: "#22d3ee", transparent: true, opacity: 0.22, depthWrite: false }), []);
  const dustMat = useMemo(() => new THREE.PointsMaterial({ color: "#9adcff", size: 0.028, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), []);
  const nebulaMat = useMemo(() => new THREE.MeshBasicMaterial({ map: nebulaTex, color: "#ffffff", side: THREE.BackSide, depthWrite: false, transparent: true }), [nebulaTex]);

  const tickMats = useMemo(() => DIRS.map(d => new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })), []);
  const tickGlowMats = useMemo(() => DIRS.map(d => new THREE.SpriteMaterial({ map: glowTex, color: d.color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })), [glowTex]);

  const cardGeo = useMemo(() => new THREE.CircleGeometry(1.5, 96), []);
  const needleGeo = useMemo(() => new THREE.ConeGeometry(0.07, 1.05, 6), []);
  const hubGeo = useMemo(() => new THREE.SphereGeometry(0.09, 20, 16), []);
  const tickGeo = useMemo(() => new THREE.BoxGeometry(0.05, 0.34, 0.05), []);
  const ringGeoA = useMemo(() => new THREE.TorusGeometry(2.15, 0.014, 8, 128), []);
  const ringGeoB = useMemo(() => new THREE.TorusGeometry(2.45, 0.012, 8, 128), []);
  const satGeo = useMemo(() => new THREE.SphereGeometry(0.06, 12, 10), []);
  const beamGeo = useMemo(() => new THREE.CylinderGeometry(0.1, 0.6, 2.9, 24, 1, true), []);
  const discGeo = useMemo(() => new THREE.CircleGeometry(2.9, 48), []);
  const nebulaGeo = useMemo(() => new THREE.SphereGeometry(42, 32, 16), []);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    return () => {
      glowTex.dispose(); faceTex.dispose(); nebulaTex.dispose(); dustGeo.dispose(); gridGeo.dispose();
      cardGeo.dispose(); needleGeo.dispose(); hubGeo.dispose(); tickGeo.dispose();
      ringGeoA.dispose(); ringGeoB.dispose(); satGeo.dispose(); beamGeo.dispose(); discGeo.dispose(); nebulaGeo.dispose();
      [holoMat, needleMat, needleTipMat, hubMat, ringMat, ringMat2, satMat, beamMat, auraMat, discMat, gridMat, dustMat, nebulaMat].forEach(m => m.dispose());
      tickMats.forEach(m => m.dispose());
      tickGlowMats.forEach(m => m.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dragging = dragRef.active;

    let hTarget: number;
    if (dragging) {
      hTarget = headingFromDrag(dragRef.x, dragRef.y);
    } else if (dir != null) {
      hTarget = DIRS[dir].rad;
    } else {
      hTarget = t * 0.12;
    }
    let diff = hTarget - heading.current;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    heading.current += diff * Math.min(1, delta * (dragging ? 14 : 4.5));
    needle.current.rotation.z = -heading.current;

    const activeIdx = dir;
    tickMats.forEach((m, i) => {
      const on = activeIdx === i;
      m.color.set(on ? DIRS[i].color : CYAN);
      m.opacity += ((on ? 1 : 0.55) - m.opacity) * Math.min(1, delta * 6);
    });
    tickGlowMats.forEach((m, i) => {
      const on = activeIdx === i;
      m.opacity += ((on ? 1 : 0) - m.opacity) * Math.min(1, delta * 6);
    });

    if (prevDir.current !== dir) {
      punch.current = 1;
      prevDir.current = dir;
    }
    punch.current *= Math.pow(0.02, delta);

    if (float.current) {
      float.current.rotation.y += delta * 0.14;
      float.current.position.y = Math.sin(t * 0.9) * 0.06;
      float.current.position.x += (mouse.current.x * 0.55 - float.current.position.x) * 0.1;
      float.current.position.z += (mouse.current.y * -0.4 - float.current.position.z) * 0.1;
      float.current.scale.setScalar(1 + punch.current * 0.08);
    }
    if (card.current) {
      card.current.rotation.x = -1.02 + Math.sin(t * 0.4) * 0.06;
      card.current.rotation.z = 0.12;
    }
    if (ringA.current) {
      ringA.current.rotation.x = 1.05 + Math.sin(t * 0.3) * 0.18;
      ringA.current.rotation.y += delta * 0.25;
      ringA.current.rotation.z += delta * 0.5;
    }
    if (ringB.current) {
      ringB.current.rotation.x = -0.8 + Math.cos(t * 0.26) * 0.15;
      ringB.current.rotation.y += delta * -0.2;
      ringB.current.rotation.z += delta * -0.35;
    }

    const activeColor = activeIdx != null ? DIRS[activeIdx].color : CYAN;
    auraMat.color.set(activeColor);
    auraMat.opacity = 0.42 + 0.16 * Math.sin(t * 1.1) + (activeIdx != null ? 0.16 : 0);
    discMat.color.set(activeColor);
    discMat.opacity = 0.32 + 0.12 * Math.sin(t * 0.9) + (activeIdx != null ? 0.2 : 0);
    beamMat.color.set(activeColor);
    beamMat.opacity = 0.09 + 0.04 * Math.sin(t * 1.4) + (activeIdx != null ? 0.05 : 0);
    ringMat.opacity = 0.42 + 0.18 * Math.sin(t * 0.6);
    ringMat2.opacity = 0.3 + 0.15 * Math.sin(t * 0.7 + 1);
    satMat.color.set(activeColor);

    const cam = state.camera;
    const swayX = Math.sin(t * 0.6) * 0.06 + Math.sin(t * 1.7) * 0.03;
    const swayY = Math.cos(t * 0.8) * 0.04 + Math.sin(t * 2.1) * 0.02;
    const tx = swayX;
    const ty = 0.75 + swayY + punch.current * 0.08;
    const tz = 7.6 + punch.current * 0.5;
    cam.position.x += (tx - cam.position.x) * 0.06;
    cam.position.y += (ty - cam.position.y) * 0.06;
    cam.position.z += (tz - cam.position.z) * 0.06;
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#bfefff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#a78bfa" />

      <mesh geometry={nebulaGeo}>
        <primitive object={nebulaMat} attach="material" />
      </mesh>

      <points geometry={dustGeo}>
        <primitive object={dustMat} attach="material" />
      </points>

      <lineSegments geometry={gridGeo} position={[0, -1.32, 0]}>
        <primitive object={gridMat} attach="material" />
      </lineSegments>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.31, 0]} geometry={discGeo}>
        <primitive object={discMat} attach="material" />
      </mesh>

      <sprite position={[0, 0.1, -1.6]} scale={[8.5, 8.5, 1]}>
        <primitive object={auraMat} attach="material" />
      </sprite>

      <mesh position={[0, -0.38, 0]} geometry={beamGeo}>
        <primitive object={beamMat} attach="material" />
      </mesh>

      <group ref={float} position={[0, 0.15, 0]}>
        <group ref={ringA}>
          <mesh>
            <primitive object={ringGeoA} attach="geometry" />
            <primitive object={ringMat} attach="material" />
          </mesh>
          {[0, Math.PI * 2 / 3, Math.PI * 4 / 3].map((a, i) => (
            <mesh key={i} position={[Math.cos(a) * 2.15, Math.sin(a) * 2.15, 0]}>
              <primitive object={satGeo} attach="geometry" />
              <primitive object={satMat} attach="material" />
            </mesh>
          ))}
        </group>

        <group ref={ringB}>
          <mesh>
            <primitive object={ringGeoB} attach="geometry" />
            <primitive object={ringMat2} attach="material" />
          </mesh>
        </group>

        <group ref={card}>
          <mesh geometry={cardGeo}>
            <primitive object={holoMat} attach="material" />
          </mesh>

          {DIRS.map((d, i) => {
            const a = d.rad;
            const px = Math.sin(a) * 1.2;
            const py = Math.cos(a) * 1.2;
            return (
              <group key={d.key}>
                <mesh position={[px, py, 0.18]} rotation={[0, 0, -a]}>
                  <primitive object={tickGeo} attach="geometry" />
                  <primitive object={tickMats[i]} attach="material" />
                </mesh>
                <sprite position={[px, py, 0.26]} scale={[0.5, 0.5, 1]}>
                  <primitive object={tickGlowMats[i]} attach="material" />
                </sprite>
              </group>
            );
          })}

          <group ref={needle} position={[0, 0, 0.05]}>
            <mesh position={[0, 0.52, 0]}>
              <primitive object={needleGeo} attach="geometry" />
              <primitive object={needleTipMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.52, 0]} rotation={[Math.PI, 0, 0]}>
              <primitive object={needleGeo} attach="geometry" />
              <primitive object={needleMat} attach="material" />
            </mesh>
            <mesh geometry={hubGeo}>
              <primitive object={hubMat} attach="material" />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}

export default function DirectionCompass({ dir, dragRef }: { dir: number | null; dragRef: DragState }) {
  return (
    <Canvas camera={{ position: [0, 0.75, 7.6], fov: 42 }} dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} style={{ pointerEvents: "none" }}>
      <CompassInner dir={dir} dragRef={dragRef} />
    </Canvas>
  );
}
