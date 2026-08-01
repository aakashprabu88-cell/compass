"use client";

import { Component, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

const PHASES = [
  { color: "#ef4444", cam: [0, 0.35, 7.4] },
  { color: "#818cf8", cam: [0, 0.55, 6.2] },
  { color: "#a855f7", cam: [0, 0.4, 5.4] },
  { color: "#10b981", cam: [0, 0.95, 5.7] },
  { color: "#22d3ee", cam: [0, 0.1, 4.7] },
] as const;

const smooth = (x: number) => {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
};

const fadeAt = (phase: number, i: number) =>
  Math.max(0, Math.min(1, smooth(phase - (i - 0.55)) * (1 - smooth(phase - (i + 0.55)))));

function makeWeb() {
  const N = 64;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < N; i++) {
    const r = 4.6 + Math.random() * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pts.push(new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)));
  }
  const pairs: number[][] = [];
  for (let i = 0; i < N; i++) {
    const d = pts.map((p, idx) => ({ idx, v: p.distanceToSquared(pts[i]) })).filter(x => x.idx !== i).sort((a, b) => a.v - b.v);
    for (let k = 0; k < 2; k++) pairs.push([i, d[k].idx]);
  }
  const pos = new Float32Array(pairs.length * 6);
  pairs.forEach(([a, b], i) => {
    pos[i * 6] = pts[a].x; pos[i * 6 + 1] = pts[a].y; pos[i * 6 + 2] = pts[a].z;
    pos[i * 6 + 3] = pts[b].x; pos[i * 6 + 4] = pts[b].y; pos[i * 6 + 5] = pts[b].z;
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

function makeBurst(n: number) {
  const pos = new Float32Array(n * 3);
  const vel = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    vel[i * 3] = dir.x * (0.6 + Math.random() * 1.1);
    vel[i * 3 + 1] = dir.y * (0.6 + Math.random() * 1.1);
    vel[i * 3 + 2] = dir.z * (0.6 + Math.random() * 1.1);
    pos[i * 3] = 0; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = 0;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return { g, vel };
}

function makeDust(n: number) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 3.4 + Math.random() * 5.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

function FilmInner({ phase }: { phase: number }) {
  const mouse = useRef({ x: 0, y: 0 });
  const root = useRef<THREE.Group>(null!);
  const ringA = useRef<THREE.Group>(null!);
  const ringB = useRef<THREE.Group>(null!);
  const needle = useRef<THREE.Group>(null!);
  const dust = useRef<THREE.Points>(null!);
  const light = useRef<THREE.PointLight>(null!);
  const g0 = useRef<THREE.Group>(null!);
  const g1 = useRef<THREE.Group>(null!);
  const g2 = useRef<THREE.Group>(null!);
  const g3 = useRef<THREE.Group>(null!);
  const g4 = useRef<THREE.Group>(null!);
  const sweep = useRef<THREE.Mesh>(null!);
  const chips = useRef<THREE.Group>(null!);
  const nodesG = useRef<THREE.Group>(null!);
  const pathG = useRef<THREE.Mesh>(null!);
  const burstG = useRef<THREE.Points>(null!);

  const groupRefs = [g0, g1, g2, g3, g4];

  const glowMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#818cf8", transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }), []);

  const shardGeo = useMemo(() => {
    const count = 110;
    const positions = new Float32Array(count * 9);
    const colors = new Float32Array(count * 9);
    for (let i = 0; i < count; i++) {
      const r = 4.4 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const cx = r * Math.sin(phi) * Math.cos(theta);
      const cy = r * Math.sin(phi) * Math.sin(theta);
      const cz = r * Math.cos(phi);
      for (let v = 0; v < 3; v++) {
        positions[i * 9 + v * 3] = cx + (Math.random() - 0.5) * 0.8;
        positions[i * 9 + v * 3 + 1] = cy + (Math.random() - 0.5) * 0.8;
        positions[i * 9 + v * 3 + 2] = cz + (Math.random() - 0.5) * 0.8;
        const shade = 0.7 + Math.random() * 0.3;
        colors[i * 9 + v * 3] = shade;
        colors[i * 9 + v * 3 + 1] = shade * 0.26;
        colors[i * 9 + v * 3 + 2] = shade * 0.26;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  const dustGeo = useMemo(() => makeDust(150), []);
  const chipGeo = useMemo(() => new THREE.OctahedronGeometry(0.16, 0), []);
  const nodeGeo = useMemo(() => new THREE.IcosahedronGeometry(0.28, 0), []);

  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 40; i++) {
      const t = i / 39;
      const a = t * Math.PI * 3.2;
      const r = 1.6 + t * 1.9;
      pts.push(new THREE.Vector3(Math.cos(a) * r, 0.2 + Math.sin(t * Math.PI) * 1.6, Math.sin(a) * r * 0.7));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  const pathGeo = useMemo(() => new THREE.TubeGeometry(curve, 90, 0.05, 8, false), [curve]);
  const pathSparksGeo = useMemo(() => {
    const pos = new Float32Array(140 * 3);
    for (let i = 0; i < 140; i++) {
      const p = curve.getPoint(Math.random());
      pos[i * 3] = p.x + (Math.random() - 0.5) * 0.6;
      pos[i * 3 + 1] = p.y + (Math.random() - 0.5) * 0.6;
      pos[i * 3 + 2] = p.z + (Math.random() - 0.5) * 0.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [curve]);

  const webGeo = useMemo(() => makeWeb(), []);
  const burst = useMemo(() => makeBurst(170), []);

  const chipsArr = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      const r = 2.55 + (i % 3) * 0.18;
      return new THREE.Vector3(Math.cos(a) * r, Math.sin(i * 2.1) * 0.55, Math.sin(a) * r * 0.82);
    }), []);

  const nodePos = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * 2.35, Math.sin(a * 1.7) * 0.5, Math.sin(a) * 2.35 * 0.8);
    }), []);

  const phaseMeta = useMemo(() => {
    const shardMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const sweepMat = new THREE.MeshBasicMaterial({ color: "#818cf8", transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    const chipMat = new THREE.MeshStandardMaterial({ color: "#818cf8", emissive: "#818cf8", emissiveIntensity: 0.6, metalness: 0.4, roughness: 0.3, transparent: true, opacity: 1 });
    const nodeMat = new THREE.MeshStandardMaterial({ color: "#a855f7", emissive: "#a855f7", emissiveIntensity: 0.7, metalness: 0.3, roughness: 0.3, transparent: true, opacity: 1 });
    const pathMat = new THREE.MeshBasicMaterial({ color: "#10b981", transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    const sparkMat = new THREE.PointsMaterial({ color: "#10b981", size: 0.06, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
    const webMat = new THREE.LineBasicMaterial({ color: "#22d3ee", transparent: true, opacity: 0.35, depthWrite: false });
    const burstMat = new THREE.PointsMaterial({ color: "#22d3ee", size: 0.09, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
    return [
      { mats: [{ mat: shardMat, base: 0.95 }], group: 0 },
      { mats: [{ mat: sweepMat, base: 0.85 }, { mat: chipMat, base: 1 }], group: 1 },
      { mats: [{ mat: nodeMat, base: 1 }], group: 2 },
      { mats: [{ mat: pathMat, base: 0.9 }, { mat: sparkMat, base: 0.9 }], group: 3 },
      { mats: [{ mat: webMat, base: 0.35 }, { mat: burstMat, base: 0.95 }], group: 4 },
    ];
  }, []);

  const shardMat = phaseMeta[0].mats[0].mat as THREE.MeshBasicMaterial;
  const sweepMat = phaseMeta[1].mats[0].mat as THREE.MeshBasicMaterial;
  const chipMat = phaseMeta[1].mats[1].mat as THREE.MeshStandardMaterial;
  const nodeMat = phaseMeta[2].mats[0].mat as THREE.MeshStandardMaterial;
  const pathMat = phaseMeta[3].mats[0].mat as THREE.MeshBasicMaterial;
  const sparkMat = phaseMeta[3].mats[1].mat as THREE.PointsMaterial;
  const webMat = phaseMeta[4].mats[0].mat as THREE.LineBasicMaterial;
  const burstMat = phaseMeta[4].mats[1].mat as THREE.PointsMaterial;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    return () => {
      shardGeo.dispose(); dustGeo.dispose(); chipGeo.dispose(); nodeGeo.dispose();
      pathGeo.dispose(); pathSparksGeo.dispose(); webGeo.dispose(); burst.g.dispose();
      [shardMat, sweepMat, chipMat, nodeMat, pathMat, sparkMat, webMat, burstMat, glowMat].forEach(m => m.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const i0 = Math.min(4, Math.floor(phase));
    const i1 = Math.min(4, i0 + 1);
    const f = Math.max(0, Math.min(1, phase - i0));
    const col = new THREE.Color(PHASES[i0].color).lerp(new THREE.Color(PHASES[i1].color), f);

    glowMat.color.copy(col);
    glowMat.opacity = 0.72 + 0.2 * Math.sin(t * 1.3);

    if (light.current) {
      light.current.color.copy(col);
      light.current.intensity = 26 + 6 * Math.sin(t * 0.8);
    }

    const rootG = root.current;
    if (rootG) {
      rootG.rotation.y += delta * 0.07;
      rootG.rotation.x = Math.sin(t * 0.1) * 0.06;
    }

    if (ringA.current) ringA.current.rotation.set(t * 0.2, 0, Math.sin(t * 0.25) * 0.2);
    if (ringB.current) ringB.current.rotation.set(0, t * 0.15, 0.5 + Math.cos(t * 0.2) * 0.2);
    if (needle.current) needle.current.rotation.z = t * 0.25 + phase * 0.4;
    if (dust.current) dust.current.rotation.set(t * 0.02, t * 0.03, 0);

    phaseMeta.forEach((meta, i) => {
      const ff = fadeAt(phase, i);
      const gr = groupRefs[meta.group].current;
      if (gr) {
        gr.visible = ff > 0.01;
        gr.scale.setScalar(0.72 + 0.28 * ff);
      }
      meta.mats.forEach(m => { m.mat.opacity = m.base * ff; });
    });

    if (sweep.current && g1.current && g1.current.visible) {
      const p = (t * 0.7) % 1;
      sweep.current.scale.setScalar(0.5 + p * 1.9);
      sweepMat.opacity = (1 - p) * 0.8;
    }

    if (chips.current) chips.current.rotation.set(0, t * 0.4, 0);

    if (nodesG.current) {
      nodesG.current.rotation.y += delta * 0.3;
      nodesG.current.children.forEach((n, i) => {
        n.scale.setScalar(1 + 0.18 * Math.sin(t * 2 + i * 1.3));
      });
    }

    if (pathG.current) pathG.current.rotation.y = t * 0.18;
    sparkMat.size = 0.05 + 0.04 * Math.sin(t * 3);

    if (burstG.current) {
      const pos = (burstG.current.geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < 170; i++) {
        pos[i * 3] += burst.vel[i * 3] * delta * 1.6;
        pos[i * 3 + 1] += burst.vel[i * 3 + 1] * delta * 1.6;
        pos[i * 3 + 2] += burst.vel[i * 3 + 2] * delta * 1.6;
        const r2 = pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2;
        if (r2 > 36) {
          pos[i * 3] = 0; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = 0;
        }
      }
      (burstG.current.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    }

    const cam = state.camera;
    const a = PHASES[i0].cam;
    const b = PHASES[i1].cam;
    const tx = a[0] + (b[0] - a[0]) * f;
    const ty = a[1] + (b[1] - a[1]) * f;
    const tz = a[2] + (b[2] - a[2]) * f;
    cam.position.x += (tx + mouse.current.x * 0.6 - cam.position.x) * 0.05;
    cam.position.y += (ty - mouse.current.y * 0.35 - cam.position.y) * 0.05;
    cam.position.z += (tz - cam.position.z) * 0.05;
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#fff1d6" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#818cf8" />
      <pointLight ref={light} position={[0, 0.5, 2.5]} intensity={26} color="#818cf8" />

      <points ref={dust} geometry={dustGeo}>
        <pointsMaterial size={0.02} color="#94a3b8" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
      </points>

      <group ref={root}>
        <group ref={ringA} rotation={[0.4, 0, 0.2]}>
          <mesh><torusGeometry args={[2.7, 0.07, 20, 96]} /><meshStandardMaterial color="#b08a3e" metalness={1} roughness={0.3} /></mesh>
        </group>
        <group ref={ringB} rotation={[-0.55, 0.3, 0.5]}>
          <mesh><torusGeometry args={[2.58, 0.045, 16, 96]} /><meshStandardMaterial color="#b08a3e" metalness={1} roughness={0.35} /></mesh>
        </group>
        <group ref={needle}>
          <mesh position={[0, 0.72, 0]}><boxGeometry args={[0.13, 1.44, 0.045]} /><meshStandardMaterial color="#ef4444" emissive="#7f1d1d" emissiveIntensity={0.4} metalness={0.6} roughness={0.35} /></mesh>
          <mesh position={[0, -0.72, 0]}><boxGeometry args={[0.13, 1.44, 0.045]} /><meshStandardMaterial color="#d7dde6" metalness={0.85} roughness={0.25} /></mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}><cylinderGeometry args={[0.12, 0.12, 0.1, 20]} /><meshStandardMaterial color="#b08a3e" metalness={1} roughness={0.3} /></mesh>
        </group>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.7, 48, 32]} />
          <primitive object={glowMat} attach="material" />
        </mesh>

        <group ref={g0}>
          <mesh geometry={shardGeo} material={shardMat} />
        </group>

        <group ref={g1}>
          <mesh ref={sweep} rotation={[Math.PI / 2.2, 0.4, 0]}>
            <torusGeometry args={[2.6, 0.012, 8, 96, Math.PI * 1.15]} />
            <primitive object={sweepMat} attach="material" />
          </mesh>
          <group ref={chips}>
            {chipsArr.map((p, i) => (
              <mesh key={i} geometry={chipGeo} material={chipMat} position={p} />
            ))}
          </group>
        </group>

        <group ref={g2}>
          <group ref={nodesG}>
            {nodePos.map((p, i) => (
              <mesh key={i} geometry={nodeGeo} material={nodeMat} position={p} />
            ))}
          </group>
        </group>

        <group ref={g3}>
          <mesh ref={pathG} geometry={pathGeo} material={pathMat} />
          <points geometry={pathSparksGeo}>
            <primitive object={sparkMat} attach="material" />
          </points>
        </group>

        <group ref={g4}>
          <lineSegments geometry={webGeo}>
            <primitive object={webMat} attach="material" />
          </lineSegments>
          <points ref={burstG} geometry={burst.g}>
            <primitive object={burstMat} attach="material" />
          </points>
        </group>
      </group>
    </>
  );
}

class FilmBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function CinematicFilm({ phase }: { phase: number }) {
  return (
    <FilmBoundary>
      <Canvas camera={{ position: [0, 0.35, 7.4], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ pointerEvents: "none" }}>
        <FilmInner phase={phase} />
      </Canvas>
    </FilmBoundary>
  );
}
