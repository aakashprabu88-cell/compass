import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Risk & growth style maps (DRY replacement for switch-case helpers) ──

const RISK_STYLES: Record<string, { text: string; bg: string }> = {
  none:     { text: "text-emerald-400", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  low:      { text: "text-green-400",   bg: "bg-green-500/10 text-green-400 border-green-500/20" },
  medium:   { text: "text-yellow-400",  bg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  high:     { text: "text-orange-400",  bg: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  critical: { text: "text-red-400",     bg: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const GROWTH_STYLES: Record<string, { text: string; bg: string }> = {
  booming:   { text: "text-emerald-400", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  growing:   { text: "text-green-400",   bg: "bg-green-500/10 text-green-400 border-green-500/20" },
  stable:    { text: "text-blue-400",    bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  declining: { text: "text-red-400",     bg: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const FALLBACK = { text: "text-slate-400", bg: "bg-slate-500/10 text-slate-400 border-slate-500/20" };

export function getRiskColor(risk: string) {
  return RISK_STYLES[risk]?.text ?? FALLBACK.text;
}

export function getRiskBg(risk: string) {
  return RISK_STYLES[risk]?.bg ?? FALLBACK.bg;
}

export function getGrowthColor(growth: string) {
  return GROWTH_STYLES[growth]?.text ?? FALLBACK.text;
}

export function getGrowthBg(growth: string) {
  return GROWTH_STYLES[growth]?.bg ?? FALLBACK.bg;
}
