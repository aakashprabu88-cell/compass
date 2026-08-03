import * as THREE from "three";

export function makeCompassFaceTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const ctx = c.getContext("2d")!;
  const cx = 512;

  const base = ctx.createRadialGradient(cx, cx, 160, cx, cx, 512);
  base.addColorStop(0, "#fdf8ec");
  base.addColorStop(0.55, "#f4ead3");
  base.addColorStop(1, "#e6d6b1");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.beginPath();
  ctx.arc(cx, cx, 500, 0, Math.PI * 2);
  ctx.fillStyle = "#b28a44";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cx, 480, 0, Math.PI * 2);
  ctx.fillStyle = "#f2e9d0";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cx, 472, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(90,60,20,0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cx, 374, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(30,30,30,0.4)";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cx, 304, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(30,30,30,0.18)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  for (let a = 0; a < 360; a += 2) {
    const rad = (a * Math.PI) / 180;
    const long = a % 30 === 0;
    const med = a % 10 === 0;
    const r1 = 468;
    const r2 = long ? 410 : med ? 446 : 464;
    ctx.beginPath();
    ctx.moveTo(cx + Math.sin(rad) * r1, cx - Math.cos(rad) * r1);
    ctx.lineTo(cx + Math.sin(rad) * r2, cx - Math.cos(rad) * r2);
    ctx.strokeStyle = long ? "#1a1a1a" : med ? "#3a3a3a" : "#6f6a58";
    ctx.lineWidth = long ? 9 : med ? 5 : 2.5;
    ctx.stroke();
  }

  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = "#7a5a20";
  for (let i = 0; i < 8; i++) {
    const a0 = (i * 45 * Math.PI) / 180;
    const aMid = (i * 45 + 22.5) * Math.PI / 180;
    const a1 = (i * 45 + 90 - 22.5) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cx);
    ctx.lineTo(cx + Math.sin(a0) * 300, cx - Math.cos(a0) * 300);
    ctx.lineTo(cx + Math.sin(aMid) * 130, cx - Math.cos(aMid) * 130);
    ctx.lineTo(cx + Math.sin(a1) * 300, cx - Math.cos(a1) * 300);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.font = "700 46px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(30,30,30,0.85)";
  for (let a = 30; a < 360; a += 30) {
    const rad = (a * Math.PI) / 180;
    ctx.fillText(String(a), cx + Math.sin(rad) * 392, cx - Math.cos(rad) * 392);
  }

  const letter = (t: string, x: number, y: number, col: string, size: number, weight: string) => {
    ctx.font = `${weight} ${size}px Georgia, 'Times New Roman', serif`;
    ctx.fillStyle = col;
    ctx.fillText(t, x, y);
  };
  letter("N", cx, cx - 344, "#c0392b", 72, "900");
  letter("E", cx + 344, cx, "#1a1a1a", 72, "900");
  letter("S", cx, cx + 344, "#1a1a1a", 72, "900");
  letter("W", cx - 344, cx, "#1a1a1a", 72, "900");
  letter("NE", cx + 250, cx - 250, "rgba(26,26,26,0.75)", 42, "700");
  letter("SE", cx + 250, cx + 250, "rgba(26,26,26,0.75)", 42, "700");
  letter("SW", cx - 250, cx + 250, "rgba(26,26,26,0.75)", 42, "700");
  letter("NW", cx - 250, cx - 250, "rgba(26,26,26,0.75)", 42, "700");

  ctx.beginPath();
  ctx.arc(cx, cx, 42, 0, Math.PI * 2);
  ctx.fillStyle = "#b28a44";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cx, 18, 0, Math.PI * 2);
  ctx.fillStyle = "#1a1a1a";
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
