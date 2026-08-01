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

function makeFaceTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(512, 512, 120, 512, 512, 560);
  g.addColorStop(0, "#e2c887");
  g.addColorStop(0.55, "#cfa95e");
  g.addColorStop(1, "#8f6b34");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(512, 512, 512, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(512, 512, 502, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(40,26,6,0.9)";
  ctx.lineWidth = 10;
  ctx.stroke();

  const P = 470;
  for (let a = 0; a < 360; a += 2) {
    const rad = (a * Math.PI) / 180;
    const major = a % 10 === 0;
    const med = a % 5 === 0;
    const r1 = 1.0;
    const r2 = major ? 0.82 : med ? 0.9 : 0.93;
    ctx.strokeStyle = major ? "rgba(35,22,6,0.85)" : med ? "rgba(35,22,6,0.55)" : "rgba(35,22,6,0.3)";
    ctx.lineWidth = major ? 8 : med ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(512 + Math.sin(rad) * P * r1, 512 - Math.cos(rad) * P * r1);
    ctx.lineTo(512 + Math.sin(rad) * P * r2, 512 - Math.cos(rad) * P * r2);
    ctx.stroke();
    if (major) {
      const lab = a === 0 ? "N" : a === 90 ? "E" : a === 180 ? "S" : a === 270 ? "W" : String(a);
      ctx.font = "700 44px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = a % 90 === 0 ? "rgba(150,26,14,0.9)" : "rgba(35,22,6,0.7)";
      ctx.fillText(lab, 512 + Math.sin(rad) * P * 0.86, 512 - Math.cos(rad) * P * 0.86);
    }
  }

  const rose = (a: number) => {
    const rad = (a * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(512, 512);
    ctx.lineTo(512 + Math.sin(rad) * 150, 512 - Math.cos(rad) * 150);
    ctx.strokeStyle = "rgba(35,22,6,0.6)";
    ctx.lineWidth = 6;
    ctx.stroke();
  };
  [0, 45, 90, 135, 180, 225, 270, 315].forEach(rose);

  ctx.beginPath();
  ctx.arc(512, 512, 58, 0, Math.PI * 2);
  ctx.fillStyle = "#8a6630";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(512, 512, 44, 0, Math.PI * 2);
  ctx.fillStyle = "#b8913f";
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
  g.addColorStop(0, "rgba(0,0,0,0.7)");
  g.addColorStop(0.55, "rgba(0,0,0,0.32)");
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
  g.addColorStop(0, "#06031a");
  g.addColorStop(0.35, "#0f0830");
  g.addColorStop(0.62, "#081028");
  g.addColorStop(1, "#040217");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);
  const blobs: [string, number, number, number][] = [
    ["rgba(245,158,11,0.12)", 240, 160, 150],
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

function CompassInner({ dir, dragRef }: { dir: number | null; dragRef: DragState }) {
  const { gl, scene } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const float = useRef<THREE.Group>(null!);
  const tilt = useRef<THREE.Group>(null!);
  const needle = useRef<THREE.Group>(null!);
  const heading = useRef(0);
  const prevDir = useRef<number | null>(null);
  const punch = useRef(0);

  const glowTex = useMemo(() => makeGlowTexture("rgba(255,255,255,0.9)", "rgba(255,255,255,0.2)"), []);
  const faceTex = useMemo(() => makeFaceTexture(), []);
  const shadowTex = useMemo(() => makeShadowTexture(), []);
  const nebulaTex = useMemo(() => makeNebulaTexture(), []);
  const dustGeo = useMemo(() => makeDust(140, 2.4, 7.5), []);

  const brassMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#b08a3e", metalness: 1, roughness: 0.24 }), []);
  const brassDarkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#7d5f28", metalness: 1, roughness: 0.45 }), []);
  const steelMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#e8e8e8", metalness: 0.95, roughness: 0.22 }), []);
  const redMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c0392b", metalness: 0.6, roughness: 0.32 }), []);
  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffffff", metalness: 0, roughness: 0.05, transmission: 0.92, thickness: 0.25, ior: 1.5,
    clearcoat: 1, clearcoatRoughness: 0.06, transparent: true, opacity: 0.9, depthWrite: false,
  }), []);
  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#f59e0b", transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const dustMat = useMemo(() => new THREE.PointsMaterial({ color: "#f5d78e", size: 0.025, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), []);
  const nebulaMat = useMemo(() => new THREE.MeshBasicMaterial({ map: nebulaTex, color: "#ffffff", side: THREE.BackSide, depthWrite: false, transparent: true }), [nebulaTex]);
  const auraMat = useMemo(() => new THREE.SpriteMaterial({ map: glowTex, color: "#f59e0b", transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }), [glowTex]);
  const discMat = useMemo(() => new THREE.MeshBasicMaterial({ map: glowTex, color: "#f59e0b", transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), [glowTex]);
  const tickMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c9a861", metalness: 0.9, roughness: 0.32 }), []);

  const nubMats = useMemo(() => DIRS.map(d => new THREE.MeshStandardMaterial({ color: "#c9a861", metalness: 0.9, roughness: 0.32, emissive: new THREE.Color(d.color), emissiveIntensity: 0 })), []);
  const nubGlowMats = useMemo(() => DIRS.map(d => new THREE.SpriteMaterial({ map: glowTex, color: d.color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })), [glowTex]);

  const pedGeo = useMemo(() => new THREE.CylinderGeometry(0.52, 0.74, 0.42, 48), []);
  const baseGeo = useMemo(() => new THREE.CylinderGeometry(0.96, 1.0, 0.09, 48), []);
  const bowlGeo = useMemo(() => new THREE.CylinderGeometry(1.14, 0.72, 0.52, 64, 1, true), []);
  const bowlCapGeo = useMemo(() => new THREE.CircleGeometry(0.72, 48), []);
  const cardCylGeo = useMemo(() => new THREE.CylinderGeometry(1.0, 1.0, 0.07, 96, 1, true), []);
  const cardGeo = useMemo(() => new THREE.CircleGeometry(1.0, 96), []);
  const bezelTorus = useMemo(() => new THREE.TorusGeometry(1.16, 0.075, 20, 96), []);
  const bezelTorus2 = useMemo(() => new THREE.TorusGeometry(1.16, 0.075, 20, 96), []);
  const tickGeo = useMemo(() => new THREE.BoxGeometry(0.05, 0.11, 0.06), []);
  const needleGeo = useMemo(() => new THREE.ConeGeometry(0.05, 0.56, 6), []);
  const hubGeo = useMemo(() => new THREE.CylinderGeometry(0.06, 0.06, 0.1, 20), []);
  const hubCapGeo = useMemo(() => new THREE.SphereGeometry(0.07, 20, 16), []);
  const domeGeo = useMemo(() => new THREE.SphereGeometry(1.18, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const discGeo = useMemo(() => new THREE.CircleGeometry(3.4, 48), []);
  const nebulaGeo = useMemo(() => new THREE.SphereGeometry(42, 32, 16), []);

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
      glowTex.dispose(); faceTex.dispose(); shadowTex.dispose(); nebulaTex.dispose(); dustGeo.dispose();
      pedGeo.dispose(); baseGeo.dispose(); bowlGeo.dispose(); bowlCapGeo.dispose();
      cardCylGeo.dispose(); cardGeo.dispose(); bezelTorus.dispose(); bezelTorus2.dispose();
      tickGeo.dispose(); needleGeo.dispose(); hubGeo.dispose(); hubCapGeo.dispose();
      domeGeo.dispose(); discGeo.dispose(); nebulaGeo.dispose();
      [brassMat, brassDarkMat, steelMat, redMat, glassMat, coreMat, dustMat, nebulaMat, auraMat, discMat, tickMat].forEach(m => m.dispose());
      nubMats.forEach(m => m.dispose());
      nubGlowMats.forEach(m => m.dispose());
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
      hTarget = Math.sin(t * 0.3) * 0.3;
    }
    let diff = hTarget - heading.current;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    heading.current += diff * Math.min(1, delta * (dragging ? 14 : 4.5));
    needle.current.rotation.z = -heading.current;

    const activeIdx = dir;
    nubMats.forEach((m, i) => {
      const on = activeIdx === i;
      m.emissiveIntensity += ((on ? 1.1 : 0) - m.emissiveIntensity) * Math.min(1, delta * 6);
    });
    nubGlowMats.forEach((m, i) => {
      const on = activeIdx === i;
      m.opacity += ((on ? 0.95 : 0) - m.opacity) * Math.min(1, delta * 6);
      m.rotation += delta * 0.5;
    });

    if (prevDir.current !== dir) {
      punch.current = 1;
      prevDir.current = dir;
    }
    punch.current *= Math.pow(0.02, delta);

    if (float.current) {
      float.current.position.y = Math.sin(t * 1.1) * 0.05;
      float.current.rotation.y = Math.sin(t * 0.24) * 0.1;
      float.current.scale.setScalar(1 + punch.current * 0.06);
    }
    if (tilt.current) {
      const tx = dragging ? dragRef.y * -0.42 : mouse.current.y * -0.08;
      const tz = dragging ? dragRef.x * 0.48 : -mouse.current.x * 0.1;
      tilt.current.rotation.x += (tx - tilt.current.rotation.x) * Math.min(1, delta * 5);
      tilt.current.rotation.z += (tz - tilt.current.rotation.z) * Math.min(1, delta * 5);
    }

    const activeColor = activeIdx != null ? DIRS[activeIdx].color : "#f59e0b";
    auraMat.color.set(activeColor);
    auraMat.opacity = 0.42 + 0.16 * Math.sin(t * 1.1) + (activeIdx != null ? 0.18 : 0);
    coreMat.color.set(activeColor);
    coreMat.opacity = 0.85 + 0.15 * Math.sin(t * 1.6);
    discMat.color.set(activeColor);
    discMat.opacity = 0.26 + 0.12 * Math.sin(t * 0.9) + (activeIdx != null ? 0.18 : 0);

    nebulaMat.opacity = 0.92;

    const cam = state.camera;
    const swayX = Math.sin(t * 0.6) * 0.05 + Math.sin(t * 1.7) * 0.02;
    const swayY = Math.cos(t * 0.8) * 0.04 + Math.sin(t * 2.1) * 0.02;
    const tx = (dragging ? 0 : mouse.current.x * 0.5) + swayX;
    const ty = 0.45 - (dragging ? 0 : mouse.current.y * 0.3) + swayY + punch.current * 0.06;
    const tz = 7.6 + punch.current * 0.5;
    cam.position.x += (tx - cam.position.x) * 0.06;
    cam.position.y += (ty - cam.position.y) * 0.06;
    cam.position.z += (tz - cam.position.z) * 0.06;
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.7} color="#fff1d6" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#818cf8" />
      <pointLight position={[0, 0.5, 3]} intensity={26} color="#f59e0b" />

      <mesh geometry={nebulaGeo}>
        <primitive object={nebulaMat} attach="material" />
      </mesh>

      <sprite position={[0, 0.15, -1.5]} scale={[7.5, 7.5, 1]}>
        <primitive object={auraMat} attach="material" />
      </sprite>

      <points geometry={dustGeo}>
        <primitive object={dustMat} attach="material" />
      </points>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]} geometry={discGeo}>
        <primitive object={discMat} attach="material" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.44, 0]}>
        <planeGeometry args={[5.4, 5.4]} />
        <meshBasicMaterial map={shadowTex} transparent opacity={0.9} depthWrite={false} />
      </mesh>

      <group ref={float} position={[0, 0.1, 0]}>
        <group ref={tilt}>
          <group position={[0, -0.72, 0]}>
            <mesh position={[0, -0.3, 0]} geometry={pedGeo}>
              <primitive object={brassDarkMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.62, 0]} geometry={baseGeo}>
              <primitive object={brassDarkMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <primitive object={bezelTorus} attach="geometry" />
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
            <primitive object={bezelTorus2} attach="geometry" />
            <primitive object={brassMat} attach="material" />
          </mesh>

          <group position={[0, 0, 0]}>
            <mesh geometry={cardCylGeo}>
              <primitive object={brassDarkMat} attach="material" />
            </mesh>
            <mesh geometry={cardGeo} position={[0, 0, 0.035]}>
              <meshBasicMaterial map={faceTex} />
            </mesh>

            {DIRS.map((d, i) => {
              const a = d.rad;
              const px = Math.sin(a) * 1.02;
              const py = Math.cos(a) * 1.02;
              return (
                <group key={d.key}>
                  <mesh position={[px, py, 0.05]} rotation={[0, 0, -a]}>
                    <primitive object={tickGeo} attach="geometry" />
                    <primitive object={nubMats[i]} attach="material" />
                  </mesh>
                  <sprite position={[px, py, 0.09]} scale={[0.42, 0.42, 1]}>
                    <primitive object={nubGlowMats[i]} attach="material" />
                  </sprite>
                </group>
              );
            })}

            <mesh position={[0, 0, 0.055]}>
              <torusGeometry args={[1.0, 0.028, 12, 96]} />
              <primitive object={brassMat} attach="material" />
            </mesh>
            {Array.from({ length: 36 }, (_, i) => {
              const a = (i / 36) * Math.PI * 2;
              const major = i % 9 === 0;
              return (
                <mesh key={i} position={[Math.sin(a) * (major ? 0.94 : 0.92), Math.cos(a) * (major ? 0.94 : 0.92), 0.062]} rotation={[0, 0, -a]}>
                  <boxGeometry args={[major ? 0.022 : 0.014, major ? 0.07 : 0.045, 0.018]} />
                  <primitive object={tickMat} attach="material" />
                </mesh>
              );
            })}

            <group ref={needle} position={[0, 0, 0.08]}>
              <mesh position={[0, 0.28, 0]}>
                <primitive object={needleGeo} attach="geometry" />
                <primitive object={redMat} attach="material" />
              </mesh>
              <mesh position={[0, -0.28, 0]} rotation={[Math.PI, 0, 0]}>
                <primitive object={needleGeo} attach="geometry" />
                <primitive object={steelMat} attach="material" />
              </mesh>
              <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={hubGeo}>
                <primitive object={brassDarkMat} attach="material" />
              </mesh>
              <mesh position={[0, 0, 0.03]} geometry={hubCapGeo}>
                <primitive object={coreMat} attach="material" />
              </mesh>
            </group>

            <mesh position={[0, 0, 0.12]} geometry={domeGeo}>
              <primitive object={glassMat} attach="material" />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}

export default function DirectionCompass({ dir, dragRef }: { dir: number | null; dragRef: DragState }) {
  return (
    <Canvas camera={{ position: [0, 0.45, 7.6], fov: 42 }} dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} style={{ pointerEvents: "none" }}>
      <CompassInner dir={dir} dragRef={dragRef} />
    </Canvas>
  );
}
