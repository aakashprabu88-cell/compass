"use client";

import { Component, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

function createFaceTexture() {
  const size = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const cx = size / 2, cy = size / 2, R = size / 2 - 20;

  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(cx, cy, R + 22, 0, Math.PI * 2);
  ctx.fillStyle = "#141a2c";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, R + 22, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(196,156,84,0.55)";
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, R - 6, 0, Math.PI * 2);
  ctx.fillStyle = "#0c1020";
  ctx.fill();

  const grad = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R);
  grad.addColorStop(0, "rgba(99,102,241,0.10)");
  grad.addColorStop(0.7, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const major = i % 18 === 0;
    const len = major ? 52 : i % 6 === 0 ? 34 : 18;
    const r1 = R - len, r2 = R - 10;
    const x1 = cx + Math.sin(a) * r1, y1 = cy - Math.cos(a) * r1;
    const x2 = cx + Math.sin(a) * r2, y2 = cy - Math.cos(a) * r2;
    ctx.strokeStyle = major ? "rgba(129,140,248,0.95)" : i % 6 === 0 ? "rgba(148,163,184,0.6)" : "rgba(148,163,184,0.35)";
    ctx.lineWidth = major ? 9 : i % 6 === 0 ? 5 : 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (i % 18 === 0) {
      const dir = ["N", "E", "S", "W"][(i / 18) % 4];
      const rr = R - 84;
      ctx.font = "900 96px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = dir === "N" ? "#f87171" : "#cbd5e1";
      ctx.fillText(dir, cx + Math.sin(a) * rr, cy - Math.cos(a) * rr);
    }
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 170, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(148,163,184,0.18)";
  ctx.lineWidth = 6;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  return tex;
}

const BRASS = { color: "#b08a3e", metalness: 1, roughness: 0.3 };

function CompassInner({ scrollRef, tumble }: { scrollRef: { current: number }; tumble: number }) {
  const group = useRef<THREE.Group>(null!);
  const gimbalA = useRef<THREE.Group>(null!);
  const gimbalB = useRef<THREE.Group>(null!);
  const needle = useRef<THREE.Group>(null!);
  const dome = useRef<THREE.Mesh>(null!);
  const dust = useRef<THREE.Points>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const face = useMemo(() => {
    const geo = new THREE.CircleGeometry(2.3, 96);
    const mat = new THREE.MeshStandardMaterial({ map: createFaceTexture(), roughness: 0.5, metalness: 0.15 });
    const mesh = new THREE.Mesh(geo, mat);
    return mesh;
  }, []);

  const dustGeo = useMemo(() => {
    const n = 260;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 3.2 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const scroll = scrollRef.current ?? 0;
    const g = group.current;
    if (!g) return;

    g.rotation.y += delta * 0.08;
    g.rotation.y += (scroll * (0.35 + tumble * 1.4) * Math.PI * 2 - g.rotation.y) * 0.04;
    g.rotation.x = -0.32 + mouse.current.y * -0.16;
    g.rotation.z = mouse.current.x * 0.28;
    g.position.y = Math.sin(t * 0.5) * 0.12;

    gimbalA.current.rotation.x = Math.sin(t * 0.4) * 0.14 + scroll * tumble * 1.6;
    gimbalB.current.rotation.z = Math.cos(t * 0.33) * 0.16;

    const target = scroll * Math.PI * 2 * (1 + tumble * 4) + t * 0.1;
    needle.current.rotation.z += (target - needle.current.rotation.z) * 0.06;

    dome.current.rotation.y += delta * 0.05;
    dust.current.rotation.y += delta * 0.015;
    dust.current.rotation.x += delta * 0.008;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.current.x * 0.7, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.4 - mouse.current.y * 0.4, 0.04);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} color="#fff1d6" />
      <directionalLight position={[-4, -2, -3]} intensity={0.7} color="#818cf8" />
      <pointLight position={[0, 2, 3.5]} intensity={30} color="#a78bfa" />

      <group ref={group}>
        <group ref={gimbalA} rotation={[0.35, 0, 0.2]}>
          <mesh>
            <torusGeometry args={[2.85, 0.09, 24, 96]} />
            <meshStandardMaterial {...BRASS} />
          </mesh>
        </group>
        <group ref={gimbalB} rotation={[-0.6, 0.3, 0.6]}>
          <mesh>
            <torusGeometry args={[2.72, 0.06, 20, 96]} />
            <meshStandardMaterial {...BRASS} />
          </mesh>
        </group>

        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.08]}>
          <cylinderGeometry args={[2.32, 2.32, 0.14, 64]} />
          <meshStandardMaterial color="#10141f" roughness={0.4} metalness={0.3} />
        </mesh>

        <primitive object={face} />

        <group ref={needle} position={[0, 0, 0.02]}>
          <mesh position={[0, 0.78, 0]}>
            <boxGeometry args={[0.16, 1.56, 0.05]} />
            <meshStandardMaterial color="#ef4444" metalness={0.6} roughness={0.35} emissive="#7f1d1d" emissiveIntensity={0.25} />
          </mesh>
          <mesh position={[0, -0.78, 0]}>
            <boxGeometry args={[0.16, 1.56, 0.05]} />
            <meshStandardMaterial color="#d7dde6" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.04]}>
            <cylinderGeometry args={[0.14, 0.14, 0.1, 24]} />
            <meshStandardMaterial {...BRASS} />
          </mesh>
        </group>

        <mesh ref={dome} position={[0, 0, 0.55]}>
          <sphereGeometry args={[2.55, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshPhysicalMaterial color="#bfd4ff" transparent opacity={0.1} roughness={0.05} metalness={0} clearcoat={1} clearcoatRoughness={0.1} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>

      <points ref={dust} geometry={dustGeo}>
        <pointsMaterial size={0.022} color="#94a3b8" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
      </points>
    </>
  );
}

class CompassBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function CompassCanvas({ scrollRef, tumble = 0.35 }: { scrollRef: { current: number }; tumble?: number }) {
  return (
    <CompassBoundary>
      <Canvas camera={{ position: [0, 0.4, 6.2], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <CompassInner scrollRef={scrollRef} tumble={tumble} />
      </Canvas>
    </CompassBoundary>
  );
}
